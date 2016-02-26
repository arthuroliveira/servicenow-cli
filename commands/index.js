/**
 * Created by arthur.oliveira on 2/15/16.
 */


module.exports = function(program){
    require('./setup')(program);
    require('./pull')(program);
    require('./token')(program);
    require('./runserver')(program);
    require('./push')(program);
};
