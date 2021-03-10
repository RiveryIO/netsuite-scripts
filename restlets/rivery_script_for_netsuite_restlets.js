/**
 *@NApiVersion 2.0
 *@NScriptType Restlet
 */
define(["N/search"], function(s) {
    function execute_search(context) {
    var is_test_connection = context.is_test_connection;
    var output = new Array();
    if (is_test_connection == 'true') {
      output.push({"is_test_connection": true});
      return output;
    }
    else {
      var mySearch = s.load({
        	id: context.customsearch_id
    	});
      var is_filters = context.is_filters;
      if (is_filters == 'true') {
        output.push(mySearch.filterExpression);
        return output;
      }
      else {
          var is_mapping = context.is_mapping;
          var start_value = context.start_value;
          var end_value = context.end_value;
          var incremental_field = context.incremental_field;
          var filter_operator = context.filter_operator;
          var filters = mySearch.filterExpression;
          if (!!filter_operator) {
               if (!!end_value) {
                    if (filters.length>0) {
                    filters.push("AND", [incremental_field,filter_operator,start_value,end_value]);
                    }
                    else {
                      filters = [incremental_field,filter_operator,start_value,end_value]
                    }
               }
               else{
                    if (filters.length>0) {
                    filters.push("AND", [incremental_field, filter_operator, start_value]);
                    }
                    else {
                      filters = [incremental_field, filter_operator, start_value]
                    }
               }
               mySearch.filterExpression = filters;
          }
          var myResultSet = mySearch.run();
          var offset = Number(context.offset);
          var max_pull_data = Number(context.max_pull_data);
          var chunk_size = Number(context.chunk_size);
          var counter = 0;
          do {
              var is_more = 'false'
              var results = myResultSet.getRange({
                  start: offset+output.length,
                  end: offset+output.length+chunk_size
              });
              for (var i = 0; !!results && i< results.length; i++) {
                  if (is_mapping == 'true') {
                      output.push(results[i].columns);
                  }
                  else {
                      output.push(results[i]);
                      counter++;
                  }
                  is_more = 'true';
               }
           }
           while (is_mapping=='false' && is_more == 'true' && counter < max_pull_data);
           return output
          }
       }
    }
    return {
        get: execute_search
    };

});
