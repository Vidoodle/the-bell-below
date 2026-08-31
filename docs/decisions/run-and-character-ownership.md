# Run and character ownership

Status: accepted.

## Decision

A run and its character are separate relational entities. A character belongs to exactly one run and stores the `run_id` foreign key. The run will own world and adventure progress; the character owns protagonist selection and stats.

Run endpoints return run state, and character endpoints return character state. Readers fetch the entities separately unless a concrete use case justifies a combined projection. Joins are not the default retrieval pattern.

## Why

The run is the lifecycle parent: it exists first conceptually and will accumulate state beyond its character. Keeping the entities separate prevents character data from becoming an increasingly large embedded part of every run read.
