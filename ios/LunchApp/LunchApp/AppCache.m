//
//  AppCache.m
//  ControleSTIB
//
//  Created by Olivier Kaisin on 07/06/13.
//  Copyright (c) 2013 Caffeine. All rights reserved.
//

#import "AppCache.h"

#define DEBUG_CACHE false

@implementation AppCache

#pragma mark - Singelton function
+ (id) sharedAppCache
{
    static AppCache *_sharedCache;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedCache = [[self alloc] init];
    });
    
    return _sharedCache;
}

- (id) init
{
    self = [super init];
    if (self) {
        [self removeAllCachedResponses];
    }
    
    return self;
}


#pragma mark - Business logic
- (NSString *) mimeTypeForPath:(NSString *) originalPath
{
	NSString *extension = [[originalPath pathExtension] lowercaseString];
    
    if ([extension isEqualToString:@"png"] || [extension isEqualToString:@"jpg"] || [extension isEqualToString:@"gif"] || [extension isEqualToString:@"jpeg"]) {
        return [NSString stringWithFormat:@"image/%@", extension];
    }
    else if ([extension isEqualToString:@"svg"]) {
        return @"image/svg+xml";
    }
    else if ([extension isEqualToString:@"css"]) {
        return [NSString stringWithFormat:@"text/%@", extension];
    }
    else if ([extension isEqualToString:@"html"] || [extension isEqualToString:@"htm"]) {
        return @"text/html";
    }
    else if ([extension isEqualToString:@"txt"]) {
        return @"text/plain";
    }
    else if ([extension isEqualToString:@"js"]) {
        return @"text/javascript";
    }
	else {
        return @"application/octet-stream";
    }
}

- (NSCachedURLResponse *) cachedResponseForRequest:(NSURLRequest *) request
{   
    // Get fragment to get the cache
    NSString *fragment = [AppCache getCachedKeyForURL:request.URL];
    if (!fragment) {
        if (DEBUG_CACHE) {
            NSLog(@"Uncached file: %@", request.URL);
        }
        
        return [super cachedResponseForRequest:request];
    }
    
    // Get real path of local file
    NSString *filePath = [[NSBundle mainBundle] pathForResource:[fragment stringByDeletingPathExtension]
                                                         ofType:[fragment pathExtension]];

    if (!filePath) {
        if (DEBUG_CACHE) {
            NSLog(@"Uncached file: %@", request.URL);
        }
        
        // Leave parent manage the caching of this file
        return [super cachedResponseForRequest:request];
    }
    
    // Load the data
    NSData *data = [NSData dataWithContentsOfFile:filePath];

    // Create the cacheable response
    NSURLResponse *response = [[NSURLResponse alloc] initWithURL:[request URL]
                                                        MIMEType:[self mimeTypeForPath:fragment]
                                           expectedContentLength:[data length]
                                                textEncodingName:nil];

    NSCachedURLResponse *cachedResponse = [[NSCachedURLResponse alloc] initWithResponse:response
                                                                                   data:data];
    if (DEBUG_CACHE) {
        NSLog(@"LOADED FROM CACHE %@", fragment);
    }
    
    return cachedResponse;
}

+ (NSString *) getCachedKeyForURL:(NSURL *) url
{
    return [AppCache getValueFromURL:url
                       forKey:@"cached"];
}

+ (NSString *) getValueFromURL: (NSURL *) url
                        forKey: (NSString *) key
{
    NSString *urlString = [url query];
    if ([[urlString substringToIndex:1] isEqualToString:@"?"]) {
        urlString = [urlString substringFromIndex:1];
    }
    
    NSArray *parts = [urlString componentsSeparatedByString:@"&"];
    for (NSString *pair in parts) {
        NSArray *elements = [pair componentsSeparatedByString:@"="];
        if ([[elements objectAtIndex:0] isEqualToString:key]) {
            return [elements objectAtIndex:1];
        }
    }
    
    return nil;
}

@end
