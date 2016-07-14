console.log('on fihr.js')
FHIR = function(url) {
    if (!url) {
        url = "https://open-api.fhir.me/"
    }
    this.url = url

    this.parmUnpack = function(x) {
        y = ''
        if (Array.isArray(x)) {
            x.forEach(function(xi) {
                y += xi + '&'
            })
        } else {
            // assume Object
            for (var p in x) {
                y += p + '=' + x[p] + '&'
            }
        }
        return y
    }

    this.getJSON = function(url) {
        // breaking free from jQuery          
        var getJSON = function(u, fun, onErr) {
            if (!u) {
                u = this.url
            }
            if (!fun) {
                fun = function(x) {
                    console.log('retrieved:', x)
                }
            }
            if (!onErr) {
                onErr = function(x) {
                    console.log('error: ', x)
                }
            }
            var c = 0
            var xhr = new XMLHttpRequest()
            xhr.open('get', u, true)
            xhr.setRequestHeader('Accept','application/json') // needed by some services like Cerner's
            // protocol, target url and assynchronicity
            xhr.send()
            /*
                xhr.onprogress=function(){
                    c++
                    console.log(c+') in progress at ',Date())
                }
                */
            xhr.onload = function(x) {
                try {
                    fun(JSON.parse(x.target.response))
                } catch (e) {
                    onErr(e)
                }
            }
            xhr.onerror = function(x) {// I don't understand who's listening to this event
            }
        }
        return new Promise(function(resolve, reject) {
            getJSON(url, function(x) {
                resolve(x)
            }, function(x) {
                reject(x)
            })
        }
        )
    }

    this.Patient = function(q, fun) { // this implementation targets the SMART service.
        // Generalizing to other services is under stydy,
        // not clear that FHIR is sufficiently standard accross the board for that yet.
        //if(!fun){fun = function(x){console.log(x)}}
        if (fun) {
            return this.Patient(q).then(function(x) {
                fun(x)
            }).catch(function(e) {
                console.log('error: ', e)
            })
        } else {
            if (!q) {
                // no q provided, get the list
                return this.getJSON(this.url + "Patient?_format=json")
            } else {
                if (typeof (q) == "string") {
                    return this.getJSON(this.url + 'Patient/?_format=json&' + q)
                } else if (q.length == 0) {
                    // to allow for empty Arrays a la matlab
                    return this.Patient(false)
                } else {
                    return this.getJSON(this.url + 'Patient/?_format=json&' + this.parmUnpack(q) + '')
                }
            }
        }
    }

    this.pre=function(x,id){ // show JSON in a <pre> element, create one if t doesn't exist
        if(!id){
            id='FHIRpre'
        }
        if(!document.getElementById(id)){
            var pre = document.createElement('pre')
            pre.id=id
            document.body.appendChild(pre)
        }
        var pre = document.getElementById(id)
        pre.innerHTML=JSON.stringify(x,null,3)
        pre.style.color='blue'
        4

    }
    // ...
}


/// UI tests

ui1 = function(){
    // list patients
    var div = document.createElement('div')
    div.id='ui1'
    div.className="container"
    document.body.appendChild(div)
    var h = '<hr><p><button id="getPatientDataSmart" type="button" class="btn btn-success">Get Patient Data (SMART)</button> name=<input id="getPatientDataSmartName" value="Ross"></p><p><button id="getPatientDataCerner" type="button" class="btn btn-primary">Get Patient Data (CERNER)</button> name=<input id="getPatientDataCernerName" value="Ross"><hr><pre id="FHIRpre">click on Get Patient Data above</pre></p>'
    div.innerHTML=h
    var getPatientDataSmartButton = document.getElementById('getPatientDataSmart')
    getPatientDataSmartButton.onclick=function(){
        var x = new FHIR() // SMART
        FHIRpre.innerHTML='retrieving data from '+x.url+' ...'
        FHIRpre.style.color='red'
        x.Patient('name='+getPatientDataSmartName.value)
         .then(function(dt){
             x.pre(dt)
         })
         .catch(function(er){
             x.pre('error:'+er)
         })
    }
    var getPatientDataCernerButton = document.getElementById('getPatientDataCerner')
    getPatientDataCernerButton.onclick=function(){
        var x = new FHIR('https://fhir-open.sandboxcernerpowerchart.com/dstu2/d075cf8b-3261-481d-97e5-ba6c48d3b41f/') // SMART
        FHIRpre.innerHTML='retrieving data from '+x.url+' ...'
        FHIRpre.style.color='red'
        x.Patient('name='+getPatientDataCernerName.value)
         .then(function(dt){
             x.pre(dt)
         })
         .catch(function(er){
             x.pre('error:'+er)
         })
    }
}

if(location.href.match('http://localhost:8000/fhir/')||location.href.match('sbu-bmi.github.io/fhir')){
   ui1() // don't show this test in other domains
}


