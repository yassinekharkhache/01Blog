package main

import (
	"log"
	"os/exec"
	"time"
)

func main() {
	for {
		cmd := exec.Command("/bin/zsh", "./deleteservice.zsh")
		output, err := cmd.CombinedOutput()
		if err != nil {
			log.Printf("Error executing script: %v\nOutput: %s\n", err, output)
		} else {
			log.Printf("Script executed successfully:\n%s\n", output)
		}

		// Wait 24 hours
		time.Sleep(24 * time.Hour)
	}
}
