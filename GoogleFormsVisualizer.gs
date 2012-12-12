/**
 * This Apps Script opens up a spreadsheet, which has an attached form, by its ID.
 * It creates a dashboard populated with controls and charts to enable visualization
 * of the submitted form data.
 * @author Kalyan Reddy (gkal.devrel@gmail.com)
 */
function doGet() {
  // Open the form-attached spreadsheet by ID.
  // If the URL is https://docs.google.com/spreadsheet/ccc?key=0Aq4s9w_HxMs7dGVtVGtTVWVlLV9PbnM5elktTVRFSVE#gid=0,
  // the ID is 0Aq4s9w_HxMs7dGVtVGtTVWVlLV9PbnM5elktTVRFSVE
  var ss = SpreadsheetApp.openById('0Aq4s9w_HxMs7dGVtVGtTVWVlLV9PbnM5elktTVRFSVE');
 
  // Get the entire data range (all form entries).
  var data = ss.getDataRange();
 
  // Create various types of filter controls for the chart.
  var ageFilter = Charts.newNumberRangeFilter().setFilterColumnIndex(2).build();
  var transportFilter = Charts.newCategoryFilter().setFilterColumnIndex(3).build();
  var nameFilter = Charts.newStringFilter().setFilterColumnIndex(1).build();
 
  // Create a table chart and look at only columns 1, 2, 3, and 4.
  var tableChart = Charts.newTableChart()
    .setDataViewDefinition(Charts.newDataViewDefinition().setColumns([1,2,3,4]))
    .build();
 
  // Create a pie chart and look at only columns 1 and 4.
  var pieChart = Charts.newPieChart()
    .setDataViewDefinition(Charts.newDataViewDefinition().setColumns([1,4]))
    .build();
 
  // Create a dashboard to bind the filters to the charts.
  var dashboard = Charts.newDashboardPanel().setDataTable(data)
    .bind([ageFilter, transportFilter, nameFilter], [tableChart, pieChart])
    .build();
 
  // Create a UiApp to display the dashboard in.
  var app = UiApp.createApplication();
  var filterPanel = app.createVerticalPanel();
  var chartPanel = app.createHorizontalPanel();
  filterPanel.add(ageFilter).add(transportFilter).add(nameFilter).setSpacing(10);
  chartPanel.add(tableChart).add(pieChart).setSpacing(10);
 
  dashboard.add(app.createVerticalPanel().add(filterPanel).add(chartPanel));
  app.add(dashboard);
  return app;
}