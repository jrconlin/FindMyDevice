create or replace function update_db() returns int language plpgsql as $$
DECLARE
    x int;
BEGIN
    select count(column_name) into x from information_schema.columns where table_name='pendingcommands' and column_name='type';
    if x = 0 then
        alter table pendingcommands add column type varchar;
        return 1;
    end if;
    return 0;
END;
$$;
select update_db()
