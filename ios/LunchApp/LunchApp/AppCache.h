//
//  AppCache.h
//  ControleSTIB
//
//  Created by Olivier Kaisin on 07/06/13.
//  Copyright (c) 2013 Caffeine. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AppCache : NSURLCache

+ (id) sharedAppCache;

+ (NSString *) getValueFromURL: (NSURL *) url
                        forKey: (NSString *) key;

@end
