# Playing with <a href="http://www.hl7.org/implement/standards/fhir/" target=_blank>FHIR</a>
HL7 new standard for HTTP-REST data services

### Live version

All you need is 

````html
<script src="http://sbu-bmi.github.io/fhir/fhir.js"></script>
````
for a live version see [http://sbu-bmi.github.io/fhir/](http://sbu-bmi.github.io/fhir/). There is also a staging version in [GoogleDrive](https://0857f9879749e82d493945f8a805968a7c031889-www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/fhir/).

### Reference material
* Fast Healthcare Interoperability Resources (FIHR) web page: [http://www.hl7.org/implement/standards/fhir](http://www.hl7.org/implement/standards/fhir/).
* All onboard: http://www.healthcareitnews.com/news/epic-cerner-others-join-hl7-project
* Why EMR companies are adopting FHIR: [video on commoditized interoperability by CERNER](https://www.youtube.com/watch?v=BbBZbo2fMus)
* SMART of FIHR: [webpage](http://smartplatforms.org/smart-on-fhir/), [video](http://player.vimeo.com/video/87132298).

### new FHIR
The [fhir.js](https://github.com/SBU-BMI/fhir/blob/gh-pages/fhir.js) library defines an object, FHIR, that is instantiated with the URL of the target data service as the single input argument. If none is declared then [open-api.fhir.me](https://open-api.fhir.me) is used by default:

````javascript
> f = new FHIR

FHIR {url: "https://open-api.fhir.me"}
````

The fhir.js library will mimic the syntax of the FHIR web serviec as closely as possible. Accordingly, a number of methods will be defined with the generic syntax 

		(new FHIR).method(parms, callback)

Lets start with the list of patients, which is obtained by using  /Patient with no patient id. It is important to recall that calling web services is assynchronous, so a callback function need to be provided as a second input argument. If none is provided then <i>console.log</i> will be used.

### .Patient(uid,fun)

In this first call we'll retrieve the 50 patients in the demo FHIR service at [open-api.fhir.me](https://open-api.fhir.me):

````javascript
> f = new FHIR
> f.Patient()

{
	author: Array[1],
	entry: Array[50],
	id: "https://open-api.fhir.me/Patient?_format=json",
	link: Array[2],
	resourceType: "Bundle",
	title: "FHIR Atom Feed",
	totalResults: 59,
	updated: "2015-01-13T02:25:08.374-00:00"
}
````

An example of a callback function could be listing the uids of those 50 patients:

````javascript
> f.Patient('',function(x){
	P = []; 
	x.entry.forEach(function(e){
		P.push(e.id)
	})
})
````

which populate the array P with the 50 patients ids:

````javascript
> P

[
	"https://open-api.fhir.me/Patient/1032702",
	"https://open-api.fhir.me/Patient/1081332",
	"https://open-api.fhir.me/Patient/1098667",
	...,
	"https://open-api.fhir.me/Patient/7777705"
]
````

Accordingly, and as percribed by the FHIR API, if a patient id is provided then the corresponding entry is returned:


````javascript
> f.Patient('1081332')

{
	active: true,
	address: Array[1],
	city: "Tulsa",
	country: "USA",
	line: Array[1],
	state: "OK",
	use: "home",
	zip: "74108",
	length: 1,
	birthDate: "2003-10-02",
	gender: Object,
	identifier: Array[1],
	name: Array[1],
	resourceType: "Patient",
	telecom: Array[3],
	text: Object
}
````

### Advanced parameterization

<a href="http://www.youtube.com/watch?feature=player_embedded&v=5Z5UtnxM1rk
" target="_blank"><img src="http://img.youtube.com/vi/5Z5UtnxM1rk/0.jpg" 
alt="click to watch screencast" width="240" height="180" border="10" /></a>


HL7/FHIR [REST API](http://hl7.org/implement/standards/fhir/http.html#summary) defines a number of possibilities for [querying](http://hl7.org/implement/standards/fhir/search.html) which require that a more flexible parameterization mechanism be allowed here. Accordingly, the first input argument of <i>.Patient</i> will be treated as a uid if it is a string but it can be used to assemble a more complex URL is it is an Array or a non Array Object:

* Array

	If uid is and Array then the URL will concatenate each element separated by a "&". For example,
	
````javascript
(new FHIR).Patient(["gender:text=female","address%state:text=OK"])
````

will return list of patients with a Oklahoma address.

* Object

The same result could have been obtained with a non-array Object, this time concatenating all attribute value pairs:

````javascript
(new FHIR).Patient({"gender:text":"female","address%state:text":"OK"})
````

<span style="color:red">Note: I need some help making sense of modifiers, is the use of "%" correct? Anyone?</span>

### More soon ...

... the rest of the FHIR API ...