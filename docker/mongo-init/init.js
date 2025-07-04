db = db.getSiblingDB("curso_git");

db.createUser({
  user: 'user',
  pwd: '123456',
  roles: [{ role: 'readWrite', db: 'curso_git' }]
});

const host = "mongo-rs:27017";

// aguarda mongod estar pronto para rs.initiate
try {
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: host }
    ]
  });
  print("✅ ReplicaSet iniciado com sucesso.");
} catch (e) {
  print("⚠️ ReplicaSet já iniciado. Ignorando.");
}
