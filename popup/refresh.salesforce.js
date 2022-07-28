


function autorefresh() {
  try {
      var seconds = new Date()
          .getSeconds();
      var time = /(..)(:..)/.exec(new Date()); // The prettyprinted time.
      var hour = time[1] % 12 || 12; // The prettyprinted hour.
      var period = ':' + seconds + ' ' + (time[1] < 12 ? 'AM' : 'PM'); // The period of the day.
      var refreshFound = false;
      if (!refreshFound && document.getElementsByTagName('iframe')) {
          // debugger;         
          var iframesVar = document.getElementsByTagName('iframe');
          if (iframesVar) {
              //10Jul,2018:Added code to support pin dashboards
              var iframeWindowVar;
              for (j = 0; j < iframesVar.length; j++) {
                  if (iframesVar[j] && iframesVar[j].src != null && (iframesVar[j].src.indexOf('salesforce.com/01Z') > -1 || iframesVar[j].src.indexOf('cloudforce.com/01Z') > -1 || iframesVar[j].src.indexOf('salesforce.com/00O') > -1)) {
                      iframeWindowVar = iframesVar[j].contentDocument;
                      if (iframeWindowVar != null && $(iframeWindowVar)
                          .find('#refreshInput') != null) {
                          if ($(iframeWindowVar)
                              .find('#refreshInput')
                              .length > 0) {
                              $(iframeWindowVar)
                                  .find('#refreshInput')
                                  .click();
                              refreshFound = true;
                          } else if ($(iframeWindowVar)
                              .find('#refreshLabel')
                              .length > 0) {
                              $(iframeWindowVar)
                                  .find('#refreshLabel')
                                  .click();
                              refreshFound = true;
                          }
                          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : Pin Dashboard : Refresh Button found, clicking ....');
                      }
                  }
              }
              if (refreshFound) return;
              //END	
              var iframeWindowVar;
              for (j = 0; j < iframesVar.length; j++) {
                  if ($(iframesVar[j])
                      .closest('.windowViewMode-maximized')
                      .hasClass('active')) {
                      if (iframesVar[j] && iframesVar[j].title == 'dashboard') {
                          //console.log('Enhance Salesforce Dashboard Chrome Extension : '+new Date()+' : '+'Dashboard iframe found ...');
                          iframeWindowVar = iframesVar[j].contentWindow;
                          break;
                      }
                  } else {
                      // To override hide iframe first - If active frame is not found.
                      if (iframesVar[j] && iframesVar[j].title == 'dashboard') {
                          iframeWindowVar = iframesVar[j].contentWindow;
                          if (isHomePageUrl()) {
                              if (iframeWindowVar != null && iframeWindowVar.document.getElementsByTagName('button')) {
                                  //console.log('Enhance Salesforce Dashboard Chrome Extension : '+new Date()+' : '+'buttons found in iframe ....');
                                  var buttons = iframeWindowVar.document.getElementsByTagName('button'),
                                      i;
                                  for (i = 0; i < buttons.length; i++) {
                                      if (buttons[i].textContent == 'Refresh' || $(buttons[i])[0].className.indexOf('refresh') > -1) {
                                          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : Lightning Dashboard : Refresh Button found, clicking ....');
                                          refreshFound = true;
                                          buttons[i].click();
                                          if (!isHomePageUrl()) {
                                              break;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
              if (iframeWindowVar != null && iframeWindowVar.document.getElementsByTagName('button')) {
                  //console.log('Enhance Salesforce Dashboard Chrome Extension : '+new Date()+' : '+'buttons found in iframe ....');
                  var buttons = iframeWindowVar.document.getElementsByTagName('button'),
                      i;
                  for (i = 0; i < buttons.length; i++) {
                      if (buttons[i].textContent == 'Refresh' || $(buttons[i])[0].className.indexOf('refresh') > -1) {
                          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : Lightning Dashboard : Refresh Button found, clicking ....');
                          refreshFound = true;
                          buttons[i].click();
                          break;
                      }
                  }
              }
          }
      }
      if (!refreshFound && document.getElementById('refreshButton')) {
          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : refreshButton found, clicking ...');
          refreshFound = true;
          document.getElementById('refreshButton')
              .click();
      }
      if (!refreshFound && document.getElementById('refreshInput')) {
          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : refreshInput found, clicking ...');
          refreshFound = true;
          document.getElementById('refreshInput')
              .click();
      }
      if (!refreshFound && document.getElementById('db_ref_btn')) {
          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : db_ref_btn found, clicking ...');
          refreshFound = true;
          document.getElementById('db_ref_btn')
              .click();
      }
      if (!refreshFound && document.getElementById('ext-comp-1005')) {
          //console.log('Enhance Salesforce Dashboard Chrome Extension : '+new Date()+' : '+'ext-comp-1005 iframe found...');
          var iframeWindowVar = document.getElementById('ext-comp-1005')
              .contentWindow;
          //console.log('Enhance Salesforce Dashboard Chrome Extension : '+new Date()+' : '+'iframe content found');
          if (iframeWindowVar.document.getElementById('refreshInput')) {
              console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : console iframe refresh button found, clicking ...');
              refreshFound = true;
              iframeWindowVar.document.getElementById('refreshInput')
                  .click();
          }
      }
      if (!refreshFound && document.getElementsByTagName('button')) {
          var buttons = document.getElementsByTagName('button'),
              i;
          for (i = 0; i < buttons.length; i++) {
            console.log(buttons[i]);
              if (buttons[i].getAttribute("alt") == 'Refresh Chart' || buttons[i].getAttribute("title") == 'Refresh Chart' || buttons[i].innerHTML.indexOf('data-key="refresh"') > -1) {
                  console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'At ' + hour + time[2] + period + ' : Lightning Home Page : Refresh Button found, clicking ....');
                  refreshFound = true;
                  buttons[i].click();
                  continue;
              }
          }
      }
      if (!refreshFound) {
          console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'Unable to locate Refresh Button.');
      }
  } catch (err) {
      console.log('Enhance Salesforce Dashboard Chrome Extension : ' + new Date() + ' : ' + 'Error Occurred : ' + err);
  }
};