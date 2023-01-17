#import <React/RCTBridgeDelegate.h>
#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@property (nonatomic, strong) UIWindow *window;
@interface AppDelegate : RCTAppDelegate
@end
