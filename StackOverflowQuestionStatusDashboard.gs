/**
* This Apps Script queries the Stack Overflow API to get the questions
* asked against a specified tag in the last 7 days. It then visualizes
* the unanswered questions vs total questions in various charts.
*
* @author Kalyan Reddy (gkal.devrel@gmail.com)
*/
function doGet() {
  var questions = getQuestions();
 
  // Create a data table with columns of interest for display in chart.
  var dataTableBuilder = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, 'Date Asked')
    .addColumn(Charts.ColumnType.NUMBER, 'Unanswered')
    .addColumn(Charts.ColumnType.NUMBER, 'Total');
 
  // Initialize two objects to store question totals by type.
  var total = {};
  var numUnanswered = {};
 
  // For each question, get the date and update question type totals.
  for (var i in questions) {
    var questionDate = new Date(questions[i].creation_date*1000).toDateString();
   
    // Initialization case.
    numUnanswered[questionDate] = numUnanswered[questionDate] || 0;
    total[questionDate] = total[questionDate] || 0;
   
    // Only increment numUnanswered if a question's answer_count is set to 0.
    if (questions[i].answer_count == 0) {
      numUnanswered[questionDate] = numUnanswered[questionDate] + 1;
    }
    total[questionDate] =  total[questionDate] + 1;
  }
 
  // Add a row for each date for the past 7 days.
  for (var i in numUnanswered) {
    dataTableBuilder.addRow([i, numUnanswered[i], total[i]]);
  }
 
  var dataTable = dataTableBuilder.build();
 
  // Create an area chart and set it to stacked mode (accumulates the two columns).
  var areaChart = Charts.newAreaChart().setDataTable(dataTable).setStacked().setDimensions(700, 500)
  .setYAxisTitle('Number of Questions')
  .setTitle('Stack Overflow Questions Unanswered vs Total')
  .build();
  var tableChart = Charts.newTableChart().setDataTable(dataTable).build();
 
  // Add the chart to a UiApp and return to the browser.
  var app = UiApp.createApplication();
  app.add(app.createVerticalPanel().add(areaChart).add(tableChart));
  return app;
}
 
/**
* Queries the Stack Overflow API to retrieve all questions tagged with a
* particular string for the last 7 days.
*/
function getQuestions() {
  var page = 1;
  var numFetched = 0;
  var questions = [];
 
  do {
    // The tag to fetch questions for.
    var tag = 'google-maps';
    var DAYS_TO_GET = 7;
    // Create a date object representing 7 days ago
    var today = new Date();
    var fromDate = Math.round(new Date(today.getTime() - DAYS_TO_GET*24*60*60*1000).getTime()/1000);
   
    // Query the API and store the result as an object.
    var result = UrlFetchApp.fetch('http://api.stackoverflow.com/1.1/questions?fromdate='+fromDate+'&page='+page+'&pagesize=100&tagged='+tag+'&sort=creation&order=asc');
    var json = Utilities.jsonParse(result.getContentText());
   
    // Save fetched questions from this page and continue fetching until there are no more questions to fetch.
    var numQuestions = json.total;
    numFetched = numFetched + json.questions.length;
    questions = questions.concat(json.questions);
   
    // Sleep so we don't hit the API too often.
    Utilities.sleep(250);
    page = page+1;
  } while (numQuestions > numFetched);
 
  return questions;
}