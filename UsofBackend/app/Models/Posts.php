<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use HasFactory;

    /**
     * @var array
     */
    protected $fillable = [
    	'user_id',
		'title',
        'date',
        'status',
        'content',
        'categories'
	];

    protected $casts = [
    	'user_id' => 'integer',
		'title' => 'string',
        'date' => 'timestamp',
        'status' => 'integer',
        'content' => 'string',
        'categories' => 'string'
    ];
}
