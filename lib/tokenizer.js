var tokenizer = function(line, delimiter, bound){
    delimiter = (delimiter === undefined)? " " : delimiter;
    bound = (bound === undefined)? "\"" : bound;
    var tokens = [];
    var i = 0;
    var token = "";
    var bounded = false;
    for(var i = 0; i < line.length; ++i){
        var next = line[i];
        if(next === delimiter && !bounded){
            if(token.length){
                tokens.push(token);
                token = "";
            }
            continue;
        } else if(next === bound && line[i - 1] !== "\\"){
            if(bounded){
                bounded = false;
                tokens.push(token);
                token = "";
                continue;
            } else{
                bounded = true;

                if(token.length){
                    tokens.push(token);
                    token = "";
                }
            }
        } else{
            token += next;
        }
    }
    if(token.length){
        tokens.push(token);
    }
    return tokens;
};

return module.exports = tokenizer;
