var localCache = {
    data: {},
    remove: function (url) {
        delete localCache.data[url];
    },
    exist: function (url) {
        return localCache.data.hasOwnProperty(url) && localCache.data[url] !== null;
    },
    get: function (url) {
        console.log('Getting in cache for url' + url);
        return localCache.data[url];
    },
    set: function (url, cachedData) {
        localCache.remove(url);
        localCache.data[url] = cachedData;
    }
};

$.when(
	$.ajax({
		url: "/qps/user?xrfkey=GAMG717cpRsrx7xR",
		type: "GET",
		headers: {
			"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
		},
		error: function (error){
			console.log(error)
		}
	})
).then(function(user){
	//console.log(user);
	var url = "/qrs/sharedcontent/full?xrfkey=GAMG717cpRsrx7xR&filter=owner.name eq '" + user.userName + "'";
	return $.ajax({
		url: url,
		type: "GET",
		headers: {
			"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
		},
		cache: true,
		complete: function(reports){
			localCache.set("sharedContent",reports);
		},
		error: function(err){
			console.log('Error: ', err);
		}
	})
});



define( ["qlik", "text!./template.html","css!./styles.css"],
	function ( qlik, template ) {
		return {
			definition: {
				type: "items",
				component: "accordion",
				items: {
					ReportSettings:{
						label: "NPrinting Report",
						items: {
							NPrintReportDropdown: {
								type: "string",
								component:"dropdown",
								label: "NPrinting Report",
								ref: "NPrintingReport",
								options: function(){
									return localCache.data.sharedContent.responseJSON.map(function(report){
										return {
											value:report.name,
											label:report.name
										}
									});
								}
							},
							buttonName:{
								type: "string",
								label: "Button Name",
								ref: "customTitle",
								defaultValue: "Generate SL Brief"
							}
						}
					}
				}
			},
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ($element) {
				document.getElementById("NPrintButton").innerHTML = $element.$parent.layout.NPrintingReport.customTitle;
				 console.log('painting')
			},
			controller: ['$scope', function ($scope ) {
				//add your rendering code here
				var NPrintProps = $scope.$parent.layout;
				NPrintButton.onclick = function retrieveReport(){ 
					$.ajax({
						url: "/qps/user?xrfkey=GAMG717cpRsrx7xR",
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
						success: function (user){
							//console.log(user);
							//get library
							$.ajax({
								url: "/qrs/sharedcontent/full?xrfkey=GAMG717cpRsrx7xR&filter=owner.name eq '" + user.userName + "' and name eq '"+NPrintProps.NPrintingReport+"'",
								type: "GET",
								headers: {
									"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
								},
								success: function (sharedContent){

									//console.log(sharedContent);
									var nPrintingEndpoint = [];
									for(i=0;i < sharedContent[0].references.length;i++){
										//console.log(i);
										nPrintingEndpoint.push(sharedContent[0].references[i].externalPath);
									}
									//console.log(nPrintingEndpoint);
									nPrintingEndpoint.reverse();
									window.open(nPrintingEndpoint[0], '_blank');
								},
								error: function (error){
									console.log(error)
								}
							});
						},
						error: function (error){
							console.log(error)
						}
					});
				}
			}]
		};

	} );
