create database quizzes;

\c quizzes;

--quizess
--answers

create table questions(
	question_id serial not null primary key,
	question_text text not null,
	question_active int default 1,
	question_created_at timestamp default current_timestamp
);

alter table questions add column question_true varchar(255) not null;

create table answers(
	answer_id serial not null primary key,
	answer_text varchar(255) not null,
	question_id int references questions(question_id)
);

insert into questions(question_text)
values('Taxoratda nechta farz bor?'),
			('Rasululloh sollallohu alayhi vassalamning otalari ismi?'),
			('Taxorat nimaning kaliti?')
;

insert into answers(answer_text, question_id)
values('Namozning', 3),
			('Jannatning', 3),
			('Saodatning', 3),
			('Poklikning', 3)
;

select 
	q.question_id as id,
	q.question_text as question,
	array_agg(a.answer_text) as answers
from 
	questions as q
left join
	answers as a on q.question_id = a.question_id
group by
	question, id
;

create table api_history(
	api_history_id serial primary key,
	api_history_text text,
	api_history_created_at timestamptz default current_timestamp
);

alter table add column api_history_ip varchar(20);
alter table add column api_history_geoip varchar(1000);
