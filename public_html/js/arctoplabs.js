/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var appName = "####appName####"; // "";
var url = 'https://api.masterdatanode.com/' + appName + '/customer/';
var access_token = '######access_token###########';
var content_type = 'application/json';

var col = 0;
var row = 0;
var cellValue = "";
var cellName = "";
var cellHeader = "";
var cellIdentifier = 0;
var totalCount = 0;


var html5todo = {};
html5todo.todos = function () {
//    $('#quiz').empty();
    var SendInfo = {"sort": {
            "Id": "asc"
        }};
    console.log(JSON.stringify(SendInfo));
    $.ajax({
        url: url + 'find',
        type: 'post',
//                        data: {},
        data: JSON.stringify(SendInfo),
        headers: {
            "access_token": access_token,
            "Content-Type": content_type
        },
        dataType: 'json',
        async: false,
        success: function (dataJson) {
            var count = 0;
            var data = [];
            //var mytable =  $('#example').DataTable();
            var result = dataJson.result;
            totalCount = dataJson.DataCount;
            console.info(JSON.stringify(dataJson));
            var counter = 0;
            $.each(result, function (k, jsonObject) {
                var dataTemp = [];
                count++;
                // .... add all the values required
//                console.info(jsonObject);
//                note_index = i;
                var language, htext, ptext, identifier, q1, q2, q3, q4, dataDate;
                identifier = jsonObject.Id;
                language = jsonObject.CustName;
                htext = jsonObject.Part;
                ptext = jsonObject.CustomerOrder;
                q1 = jsonObject.Q1;
                q2 = jsonObject.Q2;
                q3 = jsonObject.Q3;
                q4 = jsonObject.Q4;

                if (jsonObject.LaunchOn == null) {
                    dataDate = "";
                } else {
                    dataDate = jsonObject.LaunchOn;
                }

                dataTemp[0] = identifier;
                dataTemp[1] = language;
                dataTemp[2] = htext;
                dataTemp[3] = ptext;
                dataTemp[4] = q1;
                dataTemp[5] = q2;
                dataTemp[6] = q3;
                dataTemp[7] = q4;
                dataTemp[8] = dataDate;
                data[counter++] = dataTemp;
            });

//            data = [
////                ['Brazil', 'Classe A', 'Cheese', 1, '2017-01-12'],
////                ['US', 'Classe B', 'Apples', 1, '2017-01-12'],
////                ['UK', 'Classe A', 'Carrots', 1, '2017-01-12'],
////                ['CA', 'Classe C', 'Oranges', 0, '2017-01-12'],
//            ];
//            console.log(data);
            $('#my').jexcel({
                data: data,
                colHeaders: ['Id', 'CustName', 'Part', 'CustomerOrder', 'Q1', 'Q2', 'Q3', 'Q4', 'LaunchOn'],
                colWidths: [30, 150, 350, 120, 50, 50, 50, 50, 150],
                onchange: handler,
                oninsertrow: insertrow,
                ondeleterow: deleterow,
                onselection: selectionActive,
                onbeforechange: beforeChange,
                columns: [
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
                    {type: 'text'},
//                    {type: 'text'},
//                    {type: 'dropdown', source: [{'id': '1', 'name': 'Fruits'}, {'id': '2', 'name': 'Legumes'}, {'id': '3', 'name': 'General Food'}]},
//                    {type: 'checkbox'},
                    {type: 'calendar'},
                ]
            });


        }

    });
};

html5todo.update = function (cellIdentifier, cellHeader, cellValue) {

    ////alert(JSON.stringify(SendInfo)); 
    var dataInfo = {};
    dataInfo[cellHeader] = cellValue + "";
    var SendInfo = {"Data": dataInfo, "filter": {"Id": parseInt(cellIdentifier)}, "type": "single"};

    console.log(SendInfo);

    $.ajax({
        url: url + 'update',
        type: 'post',
        data: JSON.stringify(SendInfo),
        headers: {
            "access_token": access_token,
            "Content-Type": content_type,
            "origin": 'app'
        },
        async: false,
        dataType: 'json',
        success: function (data) {
//            $("#test_div").show();
            var result = $.parseJSON(JSON.stringify(data));
            console.info(JSON.stringify(result));
//            $("#test_div").html(JSON.stringify(result.description));
            html5todo.showMessage('#9BED87', 'black', 'Data updated successfully.');
//            $('#my').empty();
//            html5todo.todos();
        },
        error: function (xhr, thrownError) {
            console.info("readyState: " + xhr.readyState + "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText);
//            html5todo.showMessage('#9BED87', 'black', 'Quiz added successfully.');
//            alert(thrownError);
        }
    });
};

selectionActive = function (instance, firstColumn, lastColumn) {
    var str = $(firstColumn).prop('id');
    var cellCR = str.split("-");
    col = cellCR[0];
    row = cellCR[1];
    var cellName1 = $(instance).jexcel('getColumnNameFromId', $(firstColumn).prop('id'));
    var cellName2 = $(instance).jexcel('getColumnNameFromId', $(lastColumn).prop('id'));

    cellName = cellName1;
    cellIdentifier = $('#my').jexcel('getValue', 'A' + (parseInt(row) + 1));
    cellValue = $('#my').jexcel('getValue', cellName1);
    console.log('-----cell value ------' + (cellValue));
    console.log('The selection from ' + cellName1 + ' to ' + cellName2 + '<br>' + cellName);
    console.log("    " + col + "   ro " + row);

    cellHeader = $('#my').jexcel('getHeader', col);
    console.log(cellHeader);
}

beforeChange = function (instance, cell, value) {
    var cellName = $(instance).jexcel('getColumnNameFromId', $(cell).prop('id'));
    console.log(cell);
    console.log(value);
    console.log(cellName);
}

handler = function (obj, cell, val) {
    console.log('My table id: ' + $(obj).prop('id'));
    console.log('Cell changed: ' + $(cell).prop('id'));
    console.log('Value: ' + val);
    html5todo.update(cellIdentifier, cellHeader, val);


};

insertrow = function (obj) {
    console.log('new row added on table: ' + $(obj).prop('id'));
    console.log(col + '      ' + row);
    console.log(totalCount + 1);
    html5todo.add(totalCount + 1);

}

deleterow = function (obj) {
    console.log('row excluded on table: ' + $(obj).prop('id'));
    console.log('col changed: ' + col);
    console.log('Value: ' + row);
    html5todo.remove(cellHeader, cellValue);
}

selectrow = function (obj, cell, val) {
    var str = $(cell).prop('id');
    var cellCR = str.split("-");
    col = cellCR[0];
    row = cellCR[1];
    console.log('row excluded on table: ' + $(obj).prop('id'));
    console.log('Cell changed: ' + $(cell).prop('id'));
    console.log('Value: ' + val.val() + "    " + col + "  r " + row);
}



html5todo.add = function (dataCount) {
    var dataInfo = {};
    dataInfo["Id"] = parseInt(dataCount);
    dataInfo["CustName"] = " ";
    dataInfo["Part"] = " ";
    dataInfo["CustomerOrder"] = " ";
    dataInfo["Q1"] = " ";
    dataInfo["Q2"] = " ";
    dataInfo["Q3"] = " ";
    dataInfo["Q4"] = " ";
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + '-' + dd + '-' + mm + ' 00:00:00';
    dataInfo["LaunchOn"] = today;
    var SendInfo = {"Data": [dataInfo]};
    console.log(JSON.stringify(SendInfo));

    $.ajax({
        url: url + 'save',
        type: 'post',
        async: false,
        data: JSON.stringify(SendInfo),
        headers: {
            "access_token": access_token,
            "Content-Type": content_type,
            "origin": 'app'
        },
        dataType: 'json',
        success: function (data) {
//            $("#test_div").show();
            var result = $.parseJSON(JSON.stringify(data));
            console.info(JSON.stringify(result));
//            $("#test_div").html(JSON.stringify(result.description));
            html5todo.showMessage('#9BED87', 'black', 'Row added successfully');
            $('#my').empty();
            html5todo.todos();
        },
        error: function (xhr, thrownError) {
            alert("readyState: " + xhr.readyState + "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText);
//            html5gantt.showMessage('#9BED87', 'black', 'Vote added successfully to ' + name + '.  <small>Click Vote Again to re-vote.</small>');
//            alert(thrownError);
        }
    });
};


html5todo.remove = function (header, value) {

    ////alert(JSON.stringify(SendInfo)); 
//    var SendInfo = {"Data": [{"type": "completed", "todo": todo}]};
//    $('#my').jexcel('deleteRow', 1);
    var $valueData;
    var postINfo = {};
    console.log(header);
//    var $identifier;
    if (header == "Id") {
        postINfo["Id"] = parseInt(value);
    } else {
        postINfo[header] = parseInt(value);
    }
    var SendInfo = {"filter": postINfo, "type": "single"};
    console.log(SendInfo);

    $.ajax({
        url: url + 'delete',
        type: 'post',
        data: JSON.stringify(SendInfo),
        async: false,
        headers: {
            "access_token": access_token,
            "Content-Type": content_type,
            "origin": 'app'
        },
        dataType: 'json',
        success: function (data) {
//            $("#test_div").show();
            var result = $.parseJSON(JSON.stringify(data));
            console.info(JSON.stringify(result));
//            $("#test_div").html(JSON.stringify(result.description));
            html5todo.showMessage('#9BED87', 'black', 'Data deleted successfully.');
//            var markup = '<li id="' + identifier + 'done">' + done + '<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
//            $('#done-items').append(markup);
//            $('.remove').remove();
            //repopulate
            $('#my').empty();
            html5todo.todos();
//                    done(doneItem);
//            countTodos();
        },
        error: function (xhr, thrownError) {
            console.info("readyState: " + xhr.readyState + "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText);
            html5todo.showMessage('#9BED87', 'black', 'Error while deleting the Item.');
//            alert(thrownError);
        }
    });
};

html5todo.showMessage = function (bgcolor, color, msg) {
    if (!$('#smsg').is(':visible'))
    {
        $('html, body').animate({
            scrollTop: 0
        }, 500, function () {
            if (!$('#smsg').length)
            {
                $('<div id="smsg">' + msg + '</div>').appendTo($('body')).css({
                    position: 'absolute',
                    top: 0,
                    left: 3,
                    width: '98%',
                    height: '50px',
                    lineHeight: '30px',
                    background: bgcolor,
                    color: color,
                    zIndex: 1000,
                    padding: '10px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: 0.9,
                    margin: 'auto',
                    display: 'none'
                }).slideDown('show');
                setTimeout(function () {
                    $('#smsg').animate({'width': 'hide'}, function () {
                        $('#smsg').remove();
                    });
                }, 4000);
                $(".btn-primary").addClass('disabled');
                $(".btn-warning").removeClass('disabled');
            }
        });
    }
};


// jQuery Play
$(function () {

// initial setup
    $('#getData').click(function () {
        html5todo.add();
        return false;
    });
    $('#remove').click(function () {

        return false;
    });
    $('#science').click(function () {
        html5todo.voteResult("science");
        return false;
    });

});

