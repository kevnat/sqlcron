//Weekday Queries
const query_one = "";
const query_two = "";

var querySchedule = {
    one: {
        //every minute
        schedule : "9 * * * * *", 
        //run first query 
        query: query_one,
        //setup columns/fields
        fields: []
    },
    two: {
        // min hour day month day (week)
        //“At 09:03 on every day-of-week from Monday through Friday.”
        // schedule: "03 9 * * 1-5",*/ 
        schedule: "18 * * * * *",
        //run first query 
        query: query_two,
        //setup columns/fields
        fields: []
    }
}

module.exports = querySchedule; 