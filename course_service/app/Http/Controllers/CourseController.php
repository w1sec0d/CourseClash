<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\CourseParticipant;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $courses = Course::where('is_active','1')->get();
        $data = [
            'courses' => $courses,
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
        $course = new Course;
        $course->title = $request->title;
        $course->description = $request->input('description');
        $course->creator_id = $request->input('creator_id');
        $course->is_active = 1;
        $course->save();
        $data = [
            'message' => 'Created sucessfully',
            'course' => $course,
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
        $course = Course::find($id);
            $data = [
                'course' => $course,
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
        $course = Course::find($id);
        $course->title = $request->input('title');
        $course->description = $request->input('description');
        $course->creator_id = $request->input('creator_id');
        $course->is_active = 1;
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
        $course = Course::find($id);
        $course->is_active = 0;
        $course->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }

    public function addUserToCourse(Request $request)
    {
        $courseParticipant = new CourseParticipant;
        $courseParticipant->course_id = $request->input('course_id');
        $courseParticipant->user_id = $request->input('user_id');
        $courseParticipant->save();
        $data = [
            'message' => 'User added to course successfully',
            'status' => 200
        ];
        return response($data, $data['status']);
    }

    public function getCoursesByUserId($id)
    {
        $userCourses = CourseParticipant::where('user_id', $id)->pluck('course_id');
        if ($userCourses->isEmpty()) {
            return response(['message' => 'No courses found for this user'], 404);
        }
        $courses = Course::whereIn('id', $userCourses)->where('is_active', '1')->get();
        $data = [
            'courses' => $courses,
            'status' => 200
        ];
        return response($data, $data['status']);
    }
}
