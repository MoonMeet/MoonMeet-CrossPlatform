package org.moon.moonmeet;

import com.facebook.react.ReactActivity;

import androidx.core.view.*;
import android.os.*;
import android.view.*;
import androidx.core.graphics.*;

import static android.view.ViewGroup.MarginLayoutParams;

public class MainActivity extends ReactActivity {

  private ViewGroup contentV;

  @Override
  protected void onCreate(Bundle bundle) {
  super.onCreate(bundle);
  WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

  contentV = getWindow().findViewById(android.R.id.content);

  applyWindowInset((View)contentV);
  applyWindowGestures((View)contentV);
  }

  public void applyWindowInset(View viewGroup) {
  ViewCompat.setOnApplyWindowInsetsListener(viewGroup, (v, windowInsets) -> {
    Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());

    MarginLayoutParams mlp = (MarginLayoutParams) v.getLayoutParams();

    mlp.leftMargin = insets.left;
    mlp.bottomMargin = insets.bottom;
    mlp.rightMargin = insets.right;

    v.setLayoutParams(mlp);

    return WindowInsetsCompat.CONSUMED;
  });
  }

  public void applyWindowGestures(View viewGroup) {
  ViewCompat.setOnApplyWindowInsetsListener(viewGroup, (v, windowInsets) -> {

      Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemGestures());

      viewGroup.setPadding(insets.left, insets.top, insets.right, insets.bottom);

      return WindowInsetsCompat.CONSUMED;
  });

  }

  @Override
  protected String getMainComponentName() {
    return "MoonMeet";
  }
}
