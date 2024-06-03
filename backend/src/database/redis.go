package database

import (
	"context"
	"cow-templates/src/logger"
	"time"

	"github.com/go-redis/redis/v8"
)

var Cache *redis.Client
var CacheChannel chan string

func SetupRedis() {
	ctx := context.Background()
	Cache = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		DB:   0,
	})

	_, err := Cache.Ping(ctx).Result()
	if err != nil {
		panic(err)
	}
}

func SetupCacheChannel() {
	CacheChannel = make(chan string)

	go func(ch chan string) {
		for {
			time.Sleep(3 * time.Second)

			key := <-ch
			err := Cache.Del(context.Background(), key).Err()
			if err != nil {
				logger.Error("Error clearing cache: ", err)
			} else {
				logger.Info("Cleared cache: ", key)
			}
		}
	}(CacheChannel)
}

func ClearCache(key string) {
	CacheChannel <- key
}
