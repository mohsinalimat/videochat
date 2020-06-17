create table message (
    id bigserial primary key,
    text text NOT NULL,
    chat_id bigint NOT NULL REFERENCES chat(id) ON DELETE CASCADE,
    owner_id bigint NOT NULL,
    create_date_time timestamp NOT NULL DEFAULT (now() at time zone 'utc'),
    edit_date_time timestamp NOT NULL DEFAULT (now() at time zone 'utc')
);

create table message_read (
    id bigserial primary key,
    message_id bigint NOT NULL REFERENCES message(id) ON DELETE CASCADE,
    create_date_time timestamp NOT NULL DEFAULT (now() at time zone 'utc'),
    user_id bigint NOT NULL -- who have read the message
);