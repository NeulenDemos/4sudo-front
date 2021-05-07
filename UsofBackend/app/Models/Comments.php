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
        'date',
        'content'
	];

    protected $casts = [
    	'user_id' => 'integer',
		'post_id' => 'integer',
        'date' => 'timestamp',
        'content' => 'string'
    ];
}
