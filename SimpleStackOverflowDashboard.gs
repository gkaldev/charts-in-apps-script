/**
 * This Apps Script queries the Stack Overflow API to get the users
 * who contributed the most answers to a specific tag and visualizes
 * the data in a table filterable table chart.
 *
 * @author Kalyan Reddy (gkal.devrel@gmail.com)
 */
function doGet() {
  // Fetch the data and create an object.
  var result = UrlFetchApp.fetch('http://api.stackoverflow.com/1.1/tags/google-apps-script/top-answerers/all-time');
  var json = Utilities.jsonParse(result.getContentText());
  var top_users = json.top_users;
 
  // Create data table columns for relevant information from the result.
  var dataTableBuilder = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, 'Name')
    .addColumn(Charts.ColumnType.NUMBER, 'Reputation')
    .addColumn(Charts.ColumnType.NUMBER, 'Post Count')
    .addColumn(Charts.ColumnType.NUMBER, 'Score');
 
  // Add a row of relevant information for each of the user entries.
  for (var i in top_users) {
    var user = top_users[i];
    dataTableBuilder.addRow([user.user.display_name, user.user.reputation, user.post_count, user.score]);
  }
 
  var dataTable = dataTableBuilder.build();
 
  // Create the string filter control and the chart
  var nameFilter = Charts.newStringFilter().setFilterColumnLabel('Name').build();
  var chart = Charts.newTableChart().build();
 
  // Create the dashboard panel and bind the filter and the chart in it, setting the data table
  // built earlier.
  var dashboard = Charts.newDashboardPanel().bind(nameFilter, chart).setDataTable(dataTable).build();
 
  // Insert the dashboard in a UiApp and return so it is visible via a browser request.
  var app = UiApp.createApplication();
  dashboard.add(app.createVerticalPanel().add(nameFilter).setSpacing(10).add(chart));
  app.add(dashboard);
  return app;
}