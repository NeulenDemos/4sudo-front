<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    use HasFactory;

    /**
     * @var array
     */
    protected $fillable = [
    	'username',
		'password',
		'name',
		'email',
        'picture',
        'rating',
		'role'
	];

    /**
     * @var array
     */
    protected $hidden = [
    	'password',
		'remember_token'
	];

    protected $casts = [
        'username' => 'string',
		'password' => 'string',
		'name' => 'string',
		'email' => 'string',
        'picture' => 'integer',
        'rating' => 'integer',
		'role' => 'string'
    ];
}
