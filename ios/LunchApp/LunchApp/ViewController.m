//
//  ViewController.m
//  LunchApp
//
//  Created by Olivier Kaisin on 27/09/13.
//  Copyright (c) 2013 WooRank. All rights reserved.
//

#import "ViewController.h"
#import "AppCache.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // Set-up in-app cache wrapper
    [NSURLCache setSharedURLCache:[AppCache sharedAppCache]];
    
    // Configure webview
    [self setupWebView];
    
    // Load google
    [self loadPage:@"index"];
}

#pragma mark - WebView
- (void) setupWebView
{
    [self.webview.scrollView setBounces:NO];
}

- (void) loadPage:(NSString *) fileName
{
    // Resolve bundle path
    NSString *path = [[NSBundle mainBundle] pathForResource:fileName ofType:@"html"];

    // Read HTML contents
    NSError *error;
    NSString *html = [NSString stringWithContentsOfFile:path
                                               encoding:NSUTF8StringEncoding
                                                  error:&error];
    
    if (!error) {
        // Load HTML into the webview
        [self.webview loadHTMLString:html
                             baseURL:[NSURL URLWithString:@"http://lunchapp.loc"]];
    }
    else {
        
    }
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
