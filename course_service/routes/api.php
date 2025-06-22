<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('courses')->group(function () {
    Route::get('/','App\Http\Controllers\CourseController@index');
    Route::get('/{id}','App\Http\Controllers\CourseController@show');
    Route::get('/user/{id}','App\Http\Controllers\CourseController@getCoursesByUserId');
    Route::post('/','App\Http\Controllers\CourseController@store');
    Route::post('/adduser/','App\Http\Controllers\CourseController@addUserToCourse');
    Route::put('/{id}','App\Http\Controllers\CourseController@update');
    Route::delete('/{id}','App\Http\Controllers\CourseController@destroy');
});
Route::prefix('achievements')->group(function () {
    Route::get('/','App\Http\Controllers\AchievementsController@index');
    Route::get('/{id}','App\Http\Controllers\AchievementsController@show');
    Route::post('/','App\Http\Controllers\AchievementsController@store');
    Route::put('/{id}','App\Http\Controllers\AchievementsController@update');
    Route::delete('/{id}','App\Http\Controllers\AchievementsController@destroy');
});
Route::prefix('announcement')->group(function () {
    Route::get('/','App\Http\Controllers\AnnouncementController@index');
    Route::get('/{id}','App\Http\Controllers\AnnouncementController@show');
    Route::post('/','App\Http\Controllers\AnnouncementController@store');
    Route::put('/{id}','App\Http\Controllers\AnnouncementController@update');
    Route::delete('/{id}','App\Http\Controllers\AnnouncementController@destroy');
});
Route::prefix('message')->group(function () {
    Route::get('/','App\Http\Controllers\MessageController@index');
    Route::get('/{id}','App\Http\Controllers\MessageController@show');
    Route::post('/','App\Http\Controllers\MessageController@store');
    Route::put('/{id}','App\Http\Controllers\MessageController@update');
    Route::delete('/{id}','App\Http\Controllers\MessageController@destroy');
});
Route::prefix('notification')->group(function () {
    Route::get('/','App\Http\Controllers\NotificationController@index');
    Route::get('/{id}','App\Http\Controllers\NotificationController@show');
    Route::post('/','App\Http\Controllers\NotificationController@store');
    Route::put('/{id}','App\Http\Controllers\NotificationController@update');
    Route::delete('/{id}','App\Http\Controllers\NotificationController@destroy');
});
Route::prefix('subscription')->group(function () {
    Route::get('/','App\Http\Controllers\SubscriptionController@index');
    Route::get('/{id}','App\Http\Controllers\SubscriptionController@show');
    Route::post('/','App\Http\Controllers\SubscriptionController@store');
    Route::put('/{id}','App\Http\Controllers\SubscriptionController@update');
    Route::delete('/{id}','App\Http\Controllers\SubscriptionController@destroy');
});

Route::prefix('user_achievements')->group(function () {
    Route::get('/','App\Http\Controllers\UserAchievementsController@index');
    Route::get('/{id}','App\Http\Controllers\UserAchievementsController@show');
    Route::post('/','App\Http\Controllers\UserAchievementsController@store');
    Route::put('/{id}','App\Http\Controllers\UserAchievementsController@update');
    Route::delete('/{id}','App\Http\Controllers\UserAchievementsController@destroy');
});