function gradeCard(){
    this.name;
    this.korean;
    this.math;
    this.social;
    this.science;
    this.english;
}

gradeCard.prototype.createNewStudent = function(name, ...grade){
    this.name = name;
    this.korean = grade[0];
    this.math = grade[1];
    this.social = grade[2];
    this.science = grade[3];
    this.english = grade[4];
}

exports.a = gradeCard;