export interface Lesson {
  start: Date;
  end: Date;
  title: string;
  link: string;
}

export interface Group {
  ID: number;
  Name: string;
}

export interface Teacher {
  ID: number;
  name: string;
  surname: string;
}

export interface Subject {
  ID: number;
  Sub_name: string;
}
