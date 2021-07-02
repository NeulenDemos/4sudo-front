<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsersController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\CommentsController;
use App\Http\Controllers\AuthController;

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

const C_PATH = 'App\Http\Controllers\\';
Route::group(['prefix' => 'auth'], function ($router) {
    Route::post('login', C_PATH.'AuthController@login');
    Route::post('register', C_PATH.'AuthController@register');
    Route::middleware('auth:api')->post('logout', C_PATH.'AuthController@logout');
    Route::post('password-reset', C_PATH.'AuthController@resetPassword');
    Route::post('password-reset/{token}', C_PATH.'AuthController@newPassword');
});

Route::get('users', C_PATH.'UsersController@getAll');

Route::get('posts', C_PATH.'PostsController@getAll');
Route::get('posts/{id}', C_PATH.'PostsController@get');
Route::get('posts/{id}/comments', C_PATH.'PostsController@getComments');
Route::get('posts/{id}/categories', C_PATH.'PostsController@getCategories');

Route::get('categories', C_PATH.'CategoriesController@getAll');
Route::get('categories/{id}', C_PATH.'CategoriesController@get');
Route::get('categories/{id}/posts', C_PATH.'CategoriesController@getPosts');

Route::get('comments/{id}', C_PATH.'CommentsController@get');
Route::get('comments/{id}/like', C_PATH.'CommentsController@getLikes');

Route::group(['middleware' => 'auth:api'], function ($router) {
Route::get('users/me', C_PATH.'UsersController@getMe');
Route::get('users/favorites', C_PATH.'UsersController@getFavorites');
Route::post('users', C_PATH.'UsersController@create');
Route::post('users/avatar', C_PATH.'UsersController@avatar');
Route::patch('users/{id}', C_PATH.'UsersController@update');
Route::delete('users/{id}', C_PATH.'UsersController@delete');

Route::get('posts/{id}/like', C_PATH.'PostsController@getLike');
Route::post('posts', C_PATH.'PostsController@create');
Route::post('posts/{id}/comments', C_PATH.'PostsController@createComment');
Route::post('posts/{id}/like', C_PATH.'PostsController@createLike');
Route::post('posts/{id}/favorite', C_PATH.'PostsController@createFavorite');
Route::post('posts/{id}/subscribe', C_PATH.'PostsController@createSubscribe');
Route::patch('posts/{id}', C_PATH.'PostsController@update');
Route::delete('posts/{id}', C_PATH.'PostsController@delete');
Route::delete('posts/{id}/like', C_PATH.'PostsController@deleteLike');
Route::delete('posts/{id}/favorite', C_PATH.'PostsController@deleteFavorite');
Route::delete('posts/{id}/subscribe', C_PATH.'PostsController@deleteSubscribe');

Route::post('categories', C_PATH.'CategoriesController@create');
Route::patch('categories/{id}', C_PATH.'CategoriesController@update');
Route::delete('categories/{id}', C_PATH.'CategoriesController@delete');

Route::post('comments/{id}/like', C_PATH.'CommentsController@createLike');
Route::post('comments/{id}/best', C_PATH.'CommentsController@createBest');
Route::post('comments/{id}/comments', C_PATH.'CommentsController@createComment');
Route::patch('comments/{id}', C_PATH.'CommentsController@update');
Route::delete('comments/{id}', C_PATH.'CommentsController@delete');
Route::delete('comments/{id}/like', C_PATH.'CommentsController@deleteLike');
});

Route::get('users/{id}', C_PATH.'UsersController@get');
