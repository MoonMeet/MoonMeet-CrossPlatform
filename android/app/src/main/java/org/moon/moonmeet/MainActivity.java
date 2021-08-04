package org.moon.moonmeet;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "MoonMeet";
  }

}
