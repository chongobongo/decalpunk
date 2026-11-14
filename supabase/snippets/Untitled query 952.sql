select count(*) from job_order_list;
select count(*) from job_orders;
select count(*) from job_orders_custom_sticker;

select l.id, l.user_id, u.id as matched_user
from job_order_list l
left join users u on u.id = l.user_id;