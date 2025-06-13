<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAchievements;

class UserAchievemensController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $user_achievements = UserAchievement::all();
        $data = [
            'user_achievements' => $user_achievements,
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $user_achievement = new UserAchievement;
        $user_achievement->user_id = $request->user_id;
        $user_achievement->achievement_id = $request->input('achievement_id');
        $user_achievement->earnet_at = $request->input('earnet_at');
        $user_achievement->save();
        $data = [
            'message' => 'Created sucessfully',
            'user_achievement' => $user_achievement,
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user_achievement = UserAchievement::find($id);
        $data = [
            'user_achievement' => $user_achievement,
            'status' => 200
        ];
        return response($data,$data['status']);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $user_achievement = UserAchievement::find($id);
        $user_achievement->user_id = $request->user_id;
        $user_achievement->achievement_id = $request->input('achievement_id');
        $user_achievement->earnet_at = $request->input('earnet_at');
        $user_achievement->save();
        $data = [
            'message' => 'Updated sucessfully',
            'user_achievement' => $user_achievement,
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $user_achievement = UserAchievement::find($id);
        $user_achievement->is_active = 0;
        $user_achievement->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
