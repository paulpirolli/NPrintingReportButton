define( ["qlik", "text!./template.html","css!./styles.css"],
	function ( qlik, template ) {
		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
				return qlik.Promise.resolve();
			},
			controller: ['$scope', function ( $scope ) {
				//add your rendering code here
				NPrintButton.onclick = function retrieveReport(){ 
					$.ajax({
						url: "/qps/user?xrfkey=GAMG717cpRsrx7xR",
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
						success: function (user){
							console.log(user)
							
							//get library
							$.ajax({
								url: "/qrs/sharedcontent/full?xrfkey=GAMG717cpRsrx7xR&filter=owner.name eq '" + user.userName + "'",
								type: "GET",
								headers: {
									"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
								},
								success: function (sharedContent){
									
									console.log(sharedContent);
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
