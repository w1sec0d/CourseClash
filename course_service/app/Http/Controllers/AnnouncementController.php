<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $announcement = Announcement::all();
        return response()->json($announcement);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $announcement = new Announcement;
        $announcement->course_id = $request->input('course_id');
        $announcement->title = $request->input('title');
        $announcement->content = $request->input('image_url');
        $announcement->file_url = $request->input('file_url');
        $announcement->save();
        $data = [
            'message' => 'Created sucessfully',
            'course' => $announcement,
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
        $announcement = Announcement::find($id);
        $data = [
            'announcement' => $announcement,
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
        $announcement = Announcement::find($id);
        $announcement->course_id = $request->input('course_id');
        $announcement->title = $request->input('title');
        $announcement->content = $request->input('image_url');
        $announcement->file_url = $request->input('file_url');
        $announcement->save();
        $course->save();
        $data = [
            'message' => 'Updated sucessfully',
            'course' => $course,
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
        $announcement = $Announcement::find($id);
        $announcement->is_active = 0;
        $announcement->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
