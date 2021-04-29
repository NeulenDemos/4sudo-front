<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

// users
// categories
// posts
// comments
const C_PATH = 'App\Http\Controllers\\';

Route::post('auth/register', C_PATH.'AuthController@register');
Route::post('auth/login', C_PATH.'AuthController@login');
Route::post('auth/logout', C_PATH.'AuthController@logout');
Route::post('auth/password-reset', C_PATH.'AuthController@reset');
Route::post('auth/password-reset/{token}', C_PATH.'AuthController@newPassword');

Route::get('users', C_PATH.'UsersController@getAll');
Route::get('users/{id}', C_PATH.'UsersController@get');
Route::post('users', C_PATH.'UsersController@create');
Route::post('users/avatar', C_PATH.'UsersController@avatar');
Route::patch('users/{id}', C_PATH.'UsersController@update');
Route::delete('users/{id}', C_PATH.'UsersController@delete');

Route::get('posts', C_PATH.'PostsController@getAll');
Route::get('posts/{id}', C_PATH.'PostsController@get');
Route::get('posts/{id}/comments', C_PATH.'PostsController@getComments');
Route::post('posts/{id}/comments', C_PATH.'PostsController@createComment');
Route::get('posts/{id}/categories', C_PATH.'PostsController@getCategories');
Route::get('posts/{id}/like', C_PATH.'PostsController@getLikes');
Route::post('posts', C_PATH.'PostsController@create');
Route::post('posts/{id}/like', C_PATH.'PostsController@createLike');
Route::patch('posts/{id}', C_PATH.'PostsController@update');
Route::delete('posts/{id}', C_PATH.'PostsController@delete');
Route::delete('posts/{id}/like', C_PATH.'PostsController@deleteLike');

Route::get('categories', C_PATH.'CategoryController@getAll');
Route::get('categories/{id}', C_PATH.'CategoryController@get');
Route::get('categories/{id}/posts', C_PATH.'CategoryController@getPosts');
Route::post('categories', C_PATH.'CategoryController@create');
Route::patch('categories/{id}', C_PATH.'CategoryController@update');
Route::delete('categories/{id}', C_PATH.'CategoryController@delete');

Route::get('comments/{id}', C_PATH.'CommentController@get');
Route::get('comments/{id}/like', C_PATH.'CommentController@getLikes');
Route::post('comments/{id}/like', C_PATH.'CommentController@createLike');
Route::patch('comments/{id}', C_PATH.'CommentController@update');
Route::delete('comments/{id}', C_PATH.'CommentController@delete');
Route::delete('comments/{id}/like', C_PATH.'CommentController@deleteLike');
