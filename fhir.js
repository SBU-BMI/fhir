console.log('on fihr.js')


startFHIR=function(){
    var FHIR = function(url){
        if(!url){url="https://open-api.fhir.me/"}
        //this.lala = "ola"
        this.url=url
        this.parmUnpack=function(x){
            y=''
            if(Array.isArray(x)){
                x.forEach(function(xi){
                    y+=xi+'&'
                })
            } else { // assume Object
                for(var p in x){
                    y+=p+'='+x[p]+'&'
                }
            }
            return y
        }
        this.Patient=function(uid,fun){
            if(!fun){fun = function(x){console.log(x)}}
            if(!uid){ // no uid provided, get the list
                jQuery.getJSON(this.url+"Patient?_format=json",fun)
            }else{
                if(typeof(uid)=="string"){
                    jQuery.getJSON(this.url+'Patient/'+uid+'?_format=json',fun)
                }else if(uid.length==0){ // to allow for empty Arrays a la matlab
                    this.Patient(false,fun)
                }else{
                    jQuery.getJSON(this.url+'Patient/?'+this.parmUnpack(uid)+'_format=json',fun)
                }
            }
            return this
        }
    }
    return FHIR
}

if(!window.FHIR){ // load jQuery first
    var s = document.createElement('script')
    s.src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"
    s.onload=function(){
        FHIR = startFHIR()
    }
    document.body.appendChild(s)
} else { // no need to wait
    FHIR = startFHIR()
}
        

