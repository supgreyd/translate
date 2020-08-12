var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
app.use(bodyParser.json());
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var upload = multer({ //multer settings
  storage: storage,
  fileFilter : function(req, file, callback) { //file filter
    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
      return callback(new Error('Wrong extension type'));
    }
    callback(null, true);
  }
}).single('file');
/** API path that will upload the files */
app.post('/upload', function(req, res) {
  var exceltojson;
  upload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    /** Multer gives us file info in req.file object */
    if(!req.file){
      res.json({error_code:1,err_desc:"No file passed"});
      return;
    }
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson({
        input: req.file.path,
        output: null, //since we don't need output.json
        lowerCaseHeaders:true
      }, function(err, result){
        if(err) {
          return res.json({error_code:1,err_desc:err, data: null});
        }

        let de = {},
            en = {},
            bg = {},
            dk = {},
            ee = {},
            es = {},
            fl = {},
            fr = {},
            gr = {},
            hu = {},
            it = {},
            lt = {},
            lv = {},
            nl = {},
            no = {},
            pl = {},
            pt = {},
            ro = {},
            se = {},
            sl = {},
            sk = {}

        result.forEach((val, key) => {
          if(val)
          if (val.key) {
            de[val.key] = val.de
            en[val.key] = val.en
            bg[val.key] = val.bg
            dk[val.key] = val.dk
            ee[val.key] = val.ee
            es[val.key] = val.es
            fl[val.key] = val.fl
            fr[val.key] = val.fr
            gr[val.key] = val.gr
            hu[val.key] = val.hu
            it[val.key] = val.it
            lt[val.key] = val.lt
            lv[val.key] = val.lv
            nl[val.key] = val.nl
            no[val.key] = val.no
            pl[val.key] = val.pl
            pt[val.key] = val.pt
            ro[val.key] = val.ro
            se[val.key] = val.se
            sl[val.key] = val.sl
            sk[val.key] = val.sk
          }
        })

        let finalRes = {de, en, bg, dk,ee,es,fl,gr,hu,it,lt,lv, nl, no, pl, pt, ro, se, sl,sk}

        console.log({finalRes})
        res.json(finalRes);
      });
    } catch (e){
      res.json({error_code:1,err_desc:"Corupted excel file"});
    }
  })
});
app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});
app.listen('3003', function(){
  console.log('running on 3003...');
});