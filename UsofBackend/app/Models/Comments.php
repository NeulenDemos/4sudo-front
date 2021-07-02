<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comments extends Model
{
    use HasFactory;

    /**
     * @var array
     */
    protected $fillable = [
    	'user_id',
        'post_id',
        'comment_id',
        'date',
        'content',
        'best'
	];

    protected $casts = [
    	'user_id' => 'integer',
		'post_id' => 'integer',
		'comment_id' => 'integer',
        'date' => 'timestamp',
        'content' => 'string',
        'best' => 'integer'
    ];
}
