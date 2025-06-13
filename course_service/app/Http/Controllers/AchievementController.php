<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievement;

class AchievementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $achievements = Achievement::all();
        return response()->json($achievements);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $achievement = new Achievement;
        $achievement->name = $request->input('name');
        $achievement->description = $request->input('description');
        $achievement->image_url = $request->input('image_url');
        $achievement->points = $request->input('points');
        $achievement->save();
        $data = [
            'message' => 'Created sucessfully',
            'course' => $achievement,
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
        $achievement = Achievement::find($id);
        $data = [
            'achievement' => $achievement,
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
        $achievement = Achievement::find($id);
        $achievement->name = $request->input('name');
        $achievement->description = $request->input('description');
        $achievement->image_url = $request->input('image_url');
        $achievement->points = $request->input('points');
        $achievement->save();
        $data = [
            'message' => 'Updated sucessfully',
            'achievement' => $achievement,
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
        $achievement = Achievement::find($id);
        $achievement->is_active = 0;
        $achievement->save();
        $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
