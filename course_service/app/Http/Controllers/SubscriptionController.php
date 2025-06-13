<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $subscriptions = Subscription::all();
        $data = [
            'subscriptions' => $subscriptions,
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
        $subscription = new Subscription;
        $subscription->user_id = $request->user_id;
        $subscription->plan_name = $request->input('plan_name');
        $subscription->start_date = $request->input('start_date');
        $subscription->end_date = $request->input('end_date');
        $subscription->is_active = 1;
        $subscription->save();
        $data = [
            'message' => 'Created sucessfully',
            'subscription' => $subscription,
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
        $subscription = Subscription::find($id);
        $data = [
            'subscription' => $subscription,
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
        $subscription = new Subscription;
        $subscription->user_id = $request->user_id;
        $subscription->plan_name = $request->input('plan_name');
        $subscription->start_date = $request->input('start_date');
        $subscription->end_date = $request->input('end_date');
        $subscription->is_active = $request->input('is_active');
        $subscription->save();
        $data = [
            'message' => 'Updated sucessfully',
            'subscription' => $subscription,
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
        $subscription = Subscription::find($id);
        $subscription->is_active = 0;
        $subscription->save();
         $data = [
            'message' => 'Deleted sucessfully',
            'status' => 200
        ];
        return response($data,$data['status']);
    }
}
