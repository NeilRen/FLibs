jQuery.fn.extend({

	/**
	 * Load HTML from a remote file and inject it into the DOM, only if it's
	 * been modified by the server.
	 *
	 * @example $("#feeds").loadIfModified("feeds.html")
	 * @before <div id="feeds"></div>
	 * @result <div id="feeds"><b>45</b> feeds found.</div>
	 *
	 * @name loadIfModified
	 * @type jQuery
	 * @param String url The URL of the HTML file to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	loadIfModified: function( url, params, callback ) {
		this.load( url, params, callback, 1 );
	},

	/**
	 * Load HTML from a remote file and inject it into the DOM.
	 *
	 * @example $("#feeds").load("feeds.html")
	 * @before <div id="feeds"></div>
	 * @result <div id="feeds"><b>45</b> feeds found.</div>
	 *
 	 * @example $("#feeds").load("feeds.html",
 	 *   {test: true},
 	 *   function() { alert("load is done"); }
 	 * );
	 * @desc Same as above, but with an additional parameter
	 * and a callback that is executed when the data was loaded.
	 *
	 * @test stop();
	 * $('#first').load("data/name.php", function() {
	 * 	ok( $('#first').text() == 'ERROR', 'Check if content was injected into the DOM' );
	 * 	start();
	 * });
	 *
	 * @test stop(); // check if load can be called with only url
	 * $('#first').load("data/name.php");
	 * $.get("data/name.php", function() {
	 *   ok( $('#first').text() == 'ERROR', 'Check if load works without callback');
	 *   start();
	 * });
	 *
	 * @test stop();
	 * foobar = undefined;
	 * foo = undefined;
	 * var verifyEvaluation = function() {
	 *   ok( foobar == "bar", 'Check if script src was evaluated after load' );
	 *   start();
	 * };
	 * $('#first').load('data/test.html', function() {
	 *   ok( $('#first').html().match(/^html text/), 'Check content after loading html' );
	 *   ok( foo == "foo", 'Check if script was evaluated after load' );
	 *   setTimeout(verifyEvaluation, 600);
	 * });
	 *
	 * @name load
	 * @type jQuery
	 * @param String url The URL of the HTML file to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	load: function( url, params, callback, ifModified ) {
		if ( url.constructor == Function )
			return this.bind("load", url);
	
		callback = callback || function(){};
	
		// Default to a GET request
		var type = "GET";
	
		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( params.constructor == Function ) {
				// We assume that it's the callback
				callback = params;
				params = null;
				
			// Otherwise, build a param string
			} else {
				params = jQuery.param( params );
				type = "POST";
			}
		}
		
		var self = this;
		
		// Request the remote document
		jQuery.ajax( type, url, params,function(res, status){
			
			if ( status == "success" || !ifModified && status == "notmodified" ) {
				// Inject the HTML into all the matched elements
				self.html(res.responseText)
				  // Execute all the scripts inside of the newly-injected HTML
				  .evalScripts()
				  // Execute callback
				  .each( callback, [res.responseText, status] );
			} else
				callback.apply( self, [res.responseText, status] );
	
		}, ifModified);
		
		return this;
	},

	/**
	 * Serializes a set of input elements into a string of data.
	 * This will serialize all given elements. If you need 
	 * serialization similar to the form submit of a browser,
	 * you should use the form plugin. This is also true for
	 * selects with multiple attribute set, only a single option
	 * is serialized.
	 *
	 * @example $("input[@type=text]").serialize();
	 * @before <input type='text' name='name' value='John'/>
	 * <input type='text' name='location' value='Boston'/>
	 * @after name=John&location=Boston
	 * @desc Serialize a selection of input elements to a string
	 *
	 * @test var data = $(':input').not('button').serialize();
	 * // ignore button, IE takes text content as value, not relevant for this test
	 * ok( data == 'action=Test&text2=Test&radio1=on&radio2=on&check=on&=on&hidden=&foo[bar]=&name=name&=foobar&select1=&select2=3&select3=1', 'Check form serialization as query string' );
	 *
	 * @name serialize
	 * @type String
	 * @cat AJAX
	 */
	serialize: function() {
		return jQuery.param( this );
	},
	
	evalScripts: function() {
		return this.find('script').each(function(){
			if ( this.src )
				// for some weird reason, it doesn't work if the callback is ommited
				jQuery.getScript( this.src, function() {} );
			else
				eval.call( window, this.text || this.textContent || this.innerHTML || "" );
		}).end();
	}
	
});

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( jQuery.browser.msie && typeof XMLHttpRequest == "undefined" )
	XMLHttpRequest = function(){
		return new ActiveXObject(
			navigator.userAgent.indexOf("MSIE 5") >= 0 ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};

// Attach a bunch of functions for handling common AJAX events

/**
 * Attach a function to be executed whenever an AJAX request begins.
 *
 * @example $("#loading").ajaxStart(function(){
 *   $(this).show();
 * });
 * @desc Show a loading message whenever an AJAX request starts.
 *
 * @name ajaxStart
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * Attach a function to be executed whenever all AJAX requests have ended.
 *
 * @example $("#loading").ajaxStop(function(){
 *   $(this).hide();
 * });
 * @desc Hide a loading message after all the AJAX requests have stopped.
 *
 * @name ajaxStop
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * Attach a function to be executed whenever an AJAX request completes.
 *
 * @example $("#msg").ajaxComplete(function(){
 *   $(this).append("<li>Request Complete.</li>");
 * });
 * @desc Show a message when an AJAX request completes.
 *
 * @name ajaxComplete
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * Attach a function to be executed whenever an AJAX request completes
 * successfully.
 *
 * @example $("#msg").ajaxSuccess(function(){
 *   $(this).append("<li>Successful Request!</li>");
 * });
 * @desc Show a message when an AJAX request completes successfully.
 *
 * @name ajaxSuccess
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * Attach a function to be executed whenever an AJAX request fails.
 *
 * @example $("#msg").ajaxError(function(){
 *   $(this).append("<li>Error requesting page.</li>");
 * });
 * @desc Show a message when an AJAX request fails.
 *
 * @name ajaxError
 * @type jQuery
 * @param Function callback The function to execute.
 * @cat AJAX
 */
 
/**
 * @test stop(); var counter = { complete: 0, success: 0, error: 0 };
 * var success = function() { counter.success++ };
 * var error = function() { counter.error++ };
 * var complete = function() { counter.complete++ };
 * $('#foo').ajaxStart(complete).ajaxStop(complete).ajaxComplete(complete).ajaxError(error).ajaxSuccess(success);
 * // start with successful test
 * $.ajax({url: "data/name.php", success: success, error: error, complete: function() {
 *   ok( counter.error == 0, 'Check succesful request' );
 *   ok( counter.success == 2, 'Check succesful request' );
 *   ok( counter.complete == 3, 'Check succesful request' );
 *   counter.error = 0; counter.success = 0; counter.complete = 0;
 *   $.ajaxTimeout(500);
 *   $.ajax({url: "data/name.php?wait=5", success: success, error: error, complete: function() {
 *     ok( counter.error == 2, 'Check failed request' );
 *     ok( counter.success == 0, 'Check failed request' );
 *     ok( counter.complete == 3, 'Check failed request' );
 *     start();
 *   }});
 * }});
 
 * @test stop(); var counter = { complete: 0, success: 0, error: 0 };
 * counter.error = 0; counter.success = 0; counter.complete = 0;
 * var success = function() { counter.success++ };
 * var error = function() { counter.error++ };
 * $.ajaxTimeout(0);
 * $.ajax({url: "data/name.php", global: false, success: success, error: error, complete: function() {
 *   ok( counter.error == 0, 'Check sucesful request without globals' );
 *   ok( counter.success == 1, 'Check sucesful request without globals' );
 *   ok( counter.complete == 0, 'Check sucesful request without globals' );
 *   counter.error = 0; counter.success = 0; counter.complete = 0;
 *   $.ajaxTimeout(500);
 *   $.ajax({url: "data/name.php?wait=5", global: false, success: success, error: error, complete: function() {
 *      ok( counter.error == 1, 'Check failed request without globals' );
 *      ok( counter.success == 0, 'Check failed request without globals' );
 *      ok( counter.complete == 0, 'Check failed request without globals' );
 *      start();
 *   }});
 * }});
 * 
 * @name ajaxHandlersTesting
 * @private
 */
 

new function(){
	var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess".split(",");
	
	for ( var i = 0; i < e.length; i++ ) new function(){
		var o = e[i];
		jQuery.fn[o] = function(f){
			return this.bind(o, f);
		};
	};
};

jQuery.extend({

	/**
	 * Load a remote page using an HTTP GET request. All of the arguments to
	 * the method (except URL) are optional.
	 *
	 * @example $.get("test.cgi")
	 *
	 * @example $.get("test.cgi", { name: "John", time: "2pm" } )
	 *
	 * @example $.get("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * })
	 *
	 * @example $.get("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * )
	 *
	 * @test stop();
	 * $.get('data/dashboard.xml', function(xml) {
	 * 	var content = [];
	 * 	$('tab', xml).each(function() {
	 * 		content.push($(this).text());
	 * 	});
	 * 	ok( content[0] == 'blabla', 'Check first tab');
	 * 	ok( content[1] == 'blublu', 'Check second tab');
	 * 	start();
	 * });
	 * 
	 * @name $.get
	 * @type jQuery
	 * @param String url The URL of the page to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	get: function( url, data, callback, type, ifModified ) {
		if ( data && data.constructor == Function ) {
			type = callback;
			callback = data;
			data = null;
		}
		
		// append ? + data or & + data, in case there are already params
		if ( data ) url += ((url.indexOf("?") > -1) ? "&" : "?") + jQuery.param(data);
		
		// Build and start the HTTP Request
		jQuery.ajax( "GET", url, null, function(r, status) {
			if ( callback ) callback( jQuery.httpData(r,type), status );
		}, ifModified);
	},
	
	/**
	 * Load a remote page using an HTTP GET request, only if it hasn't
	 * been modified since it was last retrieved. All of the arguments to
	 * the method (except URL) are optional.
	 *
	 * @example $.getIfModified("test.html")
	 *
	 * @example $.getIfModified("test.html", { name: "John", time: "2pm" } )
	 *
	 * @example $.getIfModified("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * })
	 *
	 * @example $.getifModified("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * )
	 *
	 * @test stop();
	 * $.getIfModified("data/name.php", function(msg) {
	 *     ok( msg == 'ERROR', 'Check ifModified' );
	 *     start();
	 * });
	 *
	 * @name $.getIfModified
	 * @type jQuery
	 * @param String url The URL of the page to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getIfModified: function( url, data, callback, type ) {
		jQuery.get(url, data, callback, type, 1);
	},

	/**
	 * Loads, and executes, a remote JavaScript file using an HTTP GET request.
	 * All of the arguments to the method (except URL) are optional.
	 *
	 * @example $.getScript("test.js")
	 *
	 * @example $.getScript("test.js", function(){
	 *   alert("Script loaded and executed.");
	 * })
	 *
	 * @test stop();
	 * $.getScript("data/test.js", function() {
	 * 	ok( foobar == "bar", 'Check if script was evaluated' );
	 * 	start();
	 * });
	 *
	 * @test
	 * $.getScript("data/test.js");
	 * ok( true, "Check with single argument, can't verify" );
	 *
	 * @name $.getScript
	 * @type jQuery
	 * @param String url The URL of the page to load.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getScript: function( url, callback ) {
		if(callback)
			jQuery.get(url, null, callback, "script");
		else {
			jQuery.get(url, null, null, "script");
		}
	},
	
	/**
	 * Load a remote JSON object using an HTTP GET request.
	 * All of the arguments to the method (except URL) are optional.
	 *
	 * @example $.getJSON("test.js", function(json){
	 *   alert("JSON Data: " + json.users[3].name);
	 * })
	 *
	 * @example $.getJSON("test.js",
	 *   { name: "John", time: "2pm" },
	 *   function(json){
	 *     alert("JSON Data: " + json.users[3].name);
	 *   }
	 * )
	 *
	 * @test stop();
	 * $.getJSON("data/json.php", {json: "array"}, function(json) {
	 *   ok( json[0].name == 'John', 'Check JSON: first, name' );
	 *   ok( json[0].age == 21, 'Check JSON: first, age' );
	 *   ok( json[1].name == 'Peter', 'Check JSON: second, name' );
	 *   ok( json[1].age == 25, 'Check JSON: second, age' );
	 *   start();
	 * });
	 * @test stop();
	 * $.getJSON("data/json.php", function(json) {
	 *   ok( json.data.lang == 'en', 'Check JSON: lang' );
	 *   ok( json.data.length == 25, 'Check JSON: length' );
	 *   start();
	 * });
	 *
	 * @name $.getJSON
	 * @type jQuery
	 * @param String url The URL of the page to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	getJSON: function( url, data, callback ) {
		if(callback)
			jQuery.get(url, data, callback, "json");
		else {
			jQuery.get(url, data, "json");
		}
	},
	
	/**
	 * Load a remote page using an HTTP POST request. All of the arguments to
	 * the method (except URL) are optional.
	 *
	 * @example $.post("test.cgi")
	 *
	 * @example $.post("test.cgi", { name: "John", time: "2pm" } )
	 *
	 * @example $.post("test.cgi", function(data){
	 *   alert("Data Loaded: " + data);
	 * })
	 *
	 * @example $.post("test.cgi",
	 *   { name: "John", time: "2pm" },
	 *   function(data){
	 *     alert("Data Loaded: " + data);
	 *   }
	 * )
	 *
	 * @test stop();
	 * $.post("data/name.php", {xml: "5-2"}, function(xml){
	 *   $('math', xml).each(function() {
	 * 	    ok( $('calculation', this).text() == '5-2', 'Check for XML' );
	 * 	    ok( $('result', this).text() == '3', 'Check for XML' );
	 * 	 });
	 *   start();
	 * });
	 *
	 * @name $.post
	 * @type jQuery
	 * @param String url The URL of the page to load.
	 * @param Hash params A set of key/value pairs that will be sent to the server.
	 * @param Function callback A function to be executed whenever the data is loaded.
	 * @cat AJAX
	 */
	post: function( url, data, callback, type ) {
		// Build and start the HTTP Request
		jQuery.ajax( "POST", url, jQuery.param(data), function(r, status) {
			if ( callback ) callback( jQuery.httpData(r,type), status );
		});
	},
	
	// timeout (ms)
	timeout: 0,

	/**
	 * Set the timeout of all AJAX requests to a specific amount of time.
	 * This will make all future AJAX requests timeout after a specified amount
	 * of time (the default is no timeout).
	 *
	 * @example $.ajaxTimeout( 5000 );
	 * @desc Make all AJAX requests timeout after 5 seconds.
	 *
	 * @test stop();
	 * var passed = 0;
	 * var timeout;
	 * $.ajaxTimeout(1000);
	 * var pass = function() {
	 * 	passed++;
	 * 	if(passed == 2) {
	 * 		ok( true, 'Check local and global callbacks after timeout' );
	 * 		clearTimeout(timeout);
	 *      $('#main').unbind("ajaxError");
	 * 		start();
	 * 	}
	 * };
	 * var fail = function() {
	 * 	ok( false, 'Check for timeout failed' );
	 * 	start();
	 * };
	 * timeout = setTimeout(fail, 1500);
	 * $('#main').ajaxError(pass);
	 * $.ajax({
	 *   type: "GET",
	 *   url: "data/name.php?wait=5",
	 *   error: pass,
	 *   success: fail
	 * });
	 *
	 * @test stop(); $.ajaxTimeout(50);
	 * $.ajax({
	 *   type: "GET",
	 *   timeout: 5000,
	 *   url: "data/name.php?wait=1",
	 *   error: function() {
	 * 	   ok( false, 'Check for local timeout failed' );
	 * 	   start();
	 *   },
	 *   success: function() {
	 *     ok( true, 'Check for local timeout' );
	 *     start();
	 *   }
	 * });
	 * // reset timeout
	 * $.ajaxTimeout(0);
	 * 
	 *
	 * @name $.ajaxTimeout
	 * @type jQuery
	 * @param Number time How long before an AJAX request times out.
	 * @cat AJAX
	 */
	ajaxTimeout: function(timeout) {
		jQuery.timeout = timeout;
	},

	// Last-Modified header cache for next request
	lastModified: {},
	
	/**
	 * Load a remote page using an HTTP request. This function is the primary
	 * means of making AJAX requests using jQuery. $.ajax() takes one property,
	 * an object of key/value pairs, that're are used to initalize the request.
	 *
	 * These are all the key/values that can be passed in to 'prop':
	 *
	 * (String) type - The type of request to make (e.g. "POST" or "GET").
	 *
	 * (String) url - The URL of the page to request.
	 * 
	 * (String) data - A string of data to be sent to the server (POST only).
	 *
	 * (String) dataType - The type of data that you're expecting back from
	 * the server (e.g. "xml", "html", "script", or "json").
	 *
	 * (Boolean) ifModified - Allow the request to be successful only if the
	 * response has changed since the last request, default is false, ignoring
	 * the Last-Modified header
	 *
	 * (Number) timeout - Local timeout to override global timeout, eg. to give a
	 * single request a longer timeout while all others timeout after 1 seconds,
	 * see $.ajaxTimeout
	 *
	 * (Boolean) global - Wheather to trigger global AJAX event handlers for
	 * this request, default is true. Set to true to prevent that global handlers
	 * like ajaxStart or ajaxStop are triggered.
	 *
	 * (Function) error - A function to be called if the request fails. The
	 * function gets passed two arguments: The XMLHttpRequest object and a
	 * string describing the type of error that occurred.
	 *
	 * (Function) success - A function to be called if the request succeeds. The
	 * function gets passed one argument: The data returned from the server,
	 * formatted according to the 'dataType' parameter.
	 *
	 * (Function) complete - A function to be called when the request finishes. The
	 * function gets passed two arguments: The XMLHttpRequest object and a
	 * string describing the type the success of the request.
	 *
	 * @example $.ajax({
	 *   type: "GET",
	 *   url: "test.js",
	 *   dataType: "script"
	 * })
	 * @desc Load and execute a JavaScript file.
	 *
	 * @example $.ajax({
	 *   type: "POST",
	 *   url: "some.php",
	 *   data: "name=John&location=Boston",
	 *   success: function(msg){
	 *     alert( "Data Saved: " + msg );
	 *   }
	 * });
	 * @desc Save some data to the server and notify the user once its complete.
	 *
	 * @test stop();
	 * $.ajax({
	 *   type: "GET",
	 *   url: "data/name.php?name=foo",
	 *   success: function(msg){
	 *     ok( msg == 'bar', 'Check for GET' );
	 *     start();
	 *   }
	 * });
	 *
	 * @test stop();
	 * $.ajax({
	 *   type: "POST",
	 *   url: "data/name.php",
	 *   data: "name=peter",
	 *   success: function(msg){
	 *     ok( msg == 'pan', 'Check for POST' );
	 *     start();
	 *   }
	 * });
	 *
	 * @test stop();
	 * foobar = undefined;
	 * foo = undefined;
	 * var verifyEvaluation = function() {
	 *   ok( foobar == "bar", 'Check if script src was evaluated for datatype html' );
	 *   start();
	 * };
	 * $.ajax({
	 *   dataType: "html",
	 *   url: "data/test.html",
	 *   success: function(data) {
	 *     ok( data.match(/^html text/), 'Check content for datatype html' );
	 *     ok( foo == "foo", 'Check if script was evaluated for datatype html' );
	 *     setTimeout(verifyEvaluation, 600);
	 *   }
	 * });
	 *
	 * @test stop();
	 * $.ajax({
	 *   url: "data/with_fries.xml", dataType: "xml", type: "GET", data: "", success: function(resp) {
	 *     ok( $("properties", resp).length == 1, 'properties in responseXML' );
	 *     ok( $("jsconf", resp).length == 1, 'jsconf in responseXML' );
	 *     ok( $("thing", resp).length == 2, 'things in responseXML' );
	 *     start();
	 *   }
	 * });
	 *
	 * @name $.ajax
	 * @type jQuery
	 * @param Hash prop A set of properties to initialize the request with.
	 * @cat AJAX
	 */
	ajax: function( type, url, data, ret, ifModified ) {
		// If only a single argument was passed in,
		// assume that it is a object of key/value pairs
		var global = true;
		var timeout = jQuery.timeout;
		if ( !url ) {
			ret = type.complete;
			var success = type.success;
			var error = type.error;
			var dataType = type.dataType;
			var global = typeof type.global == "boolean" ? type.global : true;
			var timeout = typeof type.timeout == "number" ? type.timeout : jQuery.timeout;
			ifModified = type.ifModified || false;
			data = type.data;
			url = type.url;
			type = type.type;
		}
		
		// Watch for a new set of requests
		if ( global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		var requestDone = false;
	
		// Create the request object
		var xml = new XMLHttpRequest();
	
		// Open the socket
		xml.open(type || "GET", url, true);
		
		// Set the correct header, if data is being sent
		if ( data )
			xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		
		// Set the If-Modified-Since header, if ifModified mode.
		if ( ifModified )
			xml.setRequestHeader("If-Modified-Since",
				jQuery.lastModified[url] || "Thu, 01 Jan 1970 00:00:00 GMT" );
		
		// Set header so the called script knows that it's an XMLHttpRequest
		xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
		// Make sure the browser sends the right content length
		if ( xml.overrideMimeType )
			xml.setRequestHeader("Connection", "close");
		
		// Wait for a response to come back
		var onreadystatechange = function(istimeout){
			// The transfer is complete and the data is available, or the request timed out
			if ( xml && (xml.readyState == 4 || istimeout == "timeout") ) {
				requestDone = true;

				var status = jQuery.httpSuccess( xml ) && istimeout != "timeout" ?
					ifModified && jQuery.httpNotModified( xml, url ) ? "notmodified" : "success" : "error";
				
				// Make sure that the request was successful or notmodified
				if ( status != "error" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes;
					try {
						modRes = xml.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available
					
					if ( ifModified && modRes )
						jQuery.lastModified[url] = modRes;
					
					// If a local callback was specified, fire it
					if ( success )
						success( jQuery.httpData( xml, dataType ), status );
					
					// Fire the global callback
					if( global )
						jQuery.event.trigger( "ajaxSuccess" );
				
				// Otherwise, the request was not successful
				} else {
					// If a local callback was specified, fire it
					if ( error ) error( xml, status );
					
					// Fire the global callback
					if( global )
						jQuery.event.trigger( "ajaxError" );
				}
				
				// The request was completed
				if( global )
					jQuery.event.trigger( "ajaxComplete" );
				
				// Handle the global AJAX counter
				if ( global && ! --jQuery.active )
					jQuery.event.trigger( "ajaxStop" );
	
				// Process result
				if ( ret ) ret(xml, status);
				
				// Stop memory leaks
				xml.onreadystatechange = function(){};
				xml = null;
				
			}
		};
		xml.onreadystatechange = onreadystatechange;
		
		// Timeout checker
		if(timeout > 0)
			setTimeout(function(){
				// Check to see if the request is still happening
				if (xml) {
					// Cancel the request
					xml.abort();

					if ( !requestDone ) onreadystatechange( "timeout" );

					// Clear from memory
					xml = null;
				}
			}, timeout);
		
		// Send the data
		xml.send(data);
	},
	
	// Counter for holding the number of active queries
	active: 0,
	
	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function(r) {
		try {
			return !r.status && location.protocol == "file:" ||
				( r.status >= 200 && r.status < 300 ) || r.status == 304 ||
				jQuery.browser.safari && r.status == undefined;
		} catch(e){}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function(xml, url) {
		try {
			var xmlRes = xml.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xml.status == 304 || xmlRes == jQuery.lastModified[url] ||
				jQuery.browser.safari && xml.status == undefined;
		} catch(e){}

		return false;
	},
	
	/* Get the data out of an XMLHttpRequest.
	 * Return parsed XML if content-type header is "xml" and type is "xml" or omitted,
	 * otherwise return plain text.
	 * (String) data - The type of data that you're expecting back,
	 * (e.g. "xml", "html", "script")
	 */
	httpData: function(r,type) {
		var ct = r.getResponseHeader("content-type");
		var data = !type && ct && ct.indexOf("xml") >= 0;
		data = type == "xml" || data ? r.responseXML : r.responseText;

		// If the type is "script", eval it
		if ( type == "script" ) eval.call( window, data );

		// Get the JavaScript object, if JSON is used.
		if ( type == "json" ) eval( "data = " + data );
		
		// evaluate scripts within html
		if ( type == "html" ) $("<div>").html(data).evalScripts();

		return data;
	},
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function(a) {
		var s = [];
		
		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array || a.jquery ) {
			// Serialize the form elements
			for ( var i = 0; i < a.length; i++ )
				s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );
			
		// Otherwise, assume that it's an object of key/value pairs
		} else {
			// Serialize the key/values
			for ( var j in a )
				s.push( j + "=" + encodeURIComponent( a[j] ) );
		}
		
		// Return the resulting serialization
		return s.join("&");
	}

});
