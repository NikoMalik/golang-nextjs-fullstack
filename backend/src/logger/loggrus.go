package logger

import (
	"fmt"
	"path"
	"path/filepath"
	"runtime"
	"strconv"

	"github.com/sirupsen/logrus"
)

func Debug(msg ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Debug(msg...)
}

func Debugf(format string, args ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Debugf(format, args...)
}

func Info(msg ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Info(msg...)
}

func Infof(format string, args ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Infof(format, args...)
}

func Warn(msg ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Warn(msg...)
}

func Warnf(format string, args ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Warnf(format, args...)
}

func Error(msg ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Error(msg...)
}

func Errorf(format string, args ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Errorf(format, args...)
}

func Fatal(msg ...interface{}) {
	_, file, line, _ := runtime.Caller(1)
	logrus.WithField("location", filepath.Base(file)+":"+strconv.Itoa(line)).Fatal(msg...)
}
func New() *logrus.Logger {
	log := logrus.New()
	log.SetReportCaller(true)
	log.SetFormatter(&logrus.TextFormatter{
		CallerPrettyfier: func(f *runtime.Frame) (string, string) {
			_, file := path.Split(f.Function)
			return "", fmt.Sprintf("%s:%d", filepath.Base(file), f.Line)
		},
	})
	return log
}
