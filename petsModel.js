var mongoose = require("mongoose");

  var petsSchema = new mongoose.Schema({  
    Name:{  
        type:String  
    },  
    Type:{  
        type:String  
    },    
    Breed:{  
        type:String  
    },
    Age:{  
        type:Number  
    }
});  
   
module.exports = mongoose.model('petsModel',petsSchema);