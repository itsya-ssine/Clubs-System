CREATE TABLE student (
  student_id INTEGER PRIMARY KEY AUTOINCREMENT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  major TEXT,
  year INTEGER
);

CREATE TABLE club (
  club_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER
);

CREATE TABLE activity (
  activity_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  club_id INTEGER,
  FOREIGN KEY(club_id) REFERENCES club(club_id)
);

CREATE TABLE supervisor (
  supervisor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  last_name TEXT,
  first_name TEXT,
  role TEXT,
  email TEXT
);

CREATE TABLE room (
  room_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  capacity INTEGER,
  location TEXT
);

CREATE TABLE registration (
  student_id INTEGER,
  club_id INTEGER,
  registration_date DATE,
  status TEXT,
  PRIMARY KEY (student_id, club_id),
  FOREIGN KEY(student_id) REFERENCES student(student_id),
  FOREIGN KEY(club_id) REFERENCES club(club_id)
);

CREATE TABLE participation (
  student_id INTEGER,
  activity_id INTEGER,
  presence INTEGER DEFAULT 0,
  note TEXT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, activity_id),
  FOREIGN KEY(student_id) REFERENCES student(student_id),
  FOREIGN KEY(activity_id) REFERENCES activity(activity_id)
);

CREATE TABLE supervises (
  supervisor_id INTEGER,
  activity_id INTEGER,
  supervision_role TEXT,
  PRIMARY KEY (supervisor_id, activity_id),
  FOREIGN KEY(supervisor_id) REFERENCES supervisor(supervisor_id),
  FOREIGN KEY(activity_id) REFERENCES activity(activity_id)
);

CREATE TABLE reservation (
  reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER,
  room_id INTEGER,
  reservation_date DATE,
  start_time TIME,
  end_time TIME,
  FOREIGN KEY(activity_id) REFERENCES activity(activity_id),
  FOREIGN KEY(room_id) REFERENCES room(room_id)
);
