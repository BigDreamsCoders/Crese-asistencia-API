module.exports = (mongooseRef)=> {
    mongooseRef.connect(
        process.env.MONGOOSE_CONN,
        {useNewUrlParser: true })
        .then(answer=>{
            console.log("Successfully connected to database");
            
        })
        .catch(err=>{
            console.log("Not connected to database " + err);
        });
}