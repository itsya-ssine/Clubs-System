CREATE TABLE etudiant (
  id_etudiant INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  filiere TEXT,
  annee INTEGER
);

CREATE TABLE club (
  id_club INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  description TEXT,
  capacite INTEGER
);

CREATE TABLE activite (
  id_activite INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  type TEXT,
  date_debut DATE,
  date_fin DATE,
  heure_debut TIME,
  heure_fin TIME,
  lieu TEXT,
  id_club INTEGER,
  FOREIGN KEY(id_club) REFERENCES club(id_club)
);

CREATE TABLE encadrant (
  id_encadrant INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  prenom TEXT,
  role TEXT,
  email TEXT
);

CREATE TABLE salle (
  id_salle INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  capacite INTEGER,
  localisation TEXT
);

CREATE TABLE inscription (
  id_etudiant INTEGER,
  id_club INTEGER,
  date_inscription DATE,
  statut TEXT,
  PRIMARY KEY (id_etudiant, id_club),
  FOREIGN KEY(id_etudiant) REFERENCES etudiant(id_etudiant),
  FOREIGN KEY(id_club) REFERENCES club(id_club)
);

CREATE TABLE participation (
  id_etudiant INTEGER,
  id_activite INTEGER,
  presence INTEGER DEFAULT 0,
  note TEXT,
  date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_etudiant, id_activite),
  FOREIGN KEY(id_etudiant) REFERENCES etudiant(id_etudiant),
  FOREIGN KEY(id_activite) REFERENCES activite(id_activite)
);

CREATE TABLE encadre (
  id_encadrant INTEGER,
  id_activite INTEGER,
  role_encadrement TEXT,
  PRIMARY KEY (id_encadrant, id_activite),
  FOREIGN KEY(id_encadrant) REFERENCES encadrant(id_encadrant),
  FOREIGN KEY(id_activite) REFERENCES activite(id_activite)
);

CREATE TABLE reservation (
  id_reservation INTEGER PRIMARY KEY AUTOINCREMENT,
  id_activite INTEGER,
  id_salle INTEGER,
  date_reservation DATE,
  heure_debut TIME,
  heure_fin TIME,
  FOREIGN KEY(id_activite) REFERENCES activite(id_activite),
  FOREIGN KEY(id_salle) REFERENCES salle(id_salle)
);
