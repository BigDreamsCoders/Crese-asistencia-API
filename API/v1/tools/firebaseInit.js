module.exports = (admin, serviceAccount)=> {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://crese-asistencia-api.firebaseio.com"
    });
}