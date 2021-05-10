<?php

namespace App\Filters;

class PostFilters extends QueryFilter
{
    // sorting
    public function ordRating($order='asc')
    {
        return $this->builder->orderBy('rating', $order);
    }
    public function ordDate($order='asc')
    {
        return $this->builder->orderBy('date', $order);
    }

    // filtering
    public function category($id)
    {
        return $this->builder->where('categories', 'like', "%\"$id\"%");
    }
    public function dateFrom($date)
    {
        return $this->builder->where('date', '>=', $date);
    }
    public function dateTo($date)
    {
        return $this->builder->where('date', '<=', $date);
    }
    public function status($status)
    {
        return $this->builder->where('status', '=', $status);
    }

    // paginate
    public function page($num)
    {
        $this->page_num = $num;
    }
    public function posts_per_page($num)
    {
        $this->posts_num = $num;
    }
}
