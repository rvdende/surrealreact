
export interface SDefinition {
    syntax: string
    url: string

}

export const sqldef: SDefinition[] = [];

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/use',
    syntax: `USE [ NS @ns ] [ DB @db ];`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/let',
    syntax: `LET $@parameter = @value;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/begin',
    syntax: 'BEGIN [ TRANSACTION ];'
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/cancel',
    syntax: 'CANCEL [ TRANSACTION ];'
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/commit',
    syntax: 'COMMIT [ TRANSACTION ];'
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/ifelse',
    syntax: `IF @condition THEN
	@expression
[ ELSE IF @condition THEN
	@expression ... ]
[ ELSE
	@expression ]
END`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/select',
    syntax: `SELECT @projections
	FROM @targets
	[ WHERE @condition ]
	[ SPLIT [ AT ] @field ... ]
	[ GROUP [ BY ] @field ... ]
	[ ORDER [ BY ]
		@field [
			RAND()
			| COLLATE
			| NUMERIC
		] [ ASC | DESC ] ...
	] ]
	[ LIMIT [ BY ] @limit ]
	[ START [ AT ] @start ]
	[ FETCH @field ... ]
	[ TIMEOUT @duration ]
	[ PARALLEL ]
;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/insert',
    syntax: `INSERT [ IGNORE ] INTO @what
	[ @value
	  | (@fields) VALUES (@values)
		[ ON DUPLICATE KEY UPDATE @field = @value ... ]
	]
;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/create',
    syntax: `CREATE @targets
	[ CONTENT @value
	  | SET @field = @value ...
	]
	[ RETURN [ NONE | BEFORE | AFTER | DIFF | @projections ... ]
	[ TIMEOUT @duration ]
	[ PARALLEL ]
;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/update',
    syntax: `UPDATE @targets
	[ CONTENT @value
	  | MERGE @value
	  | PATCH @value
	  | SET @field = @value ...
	]
	[ WHERE @condition ]
	[ RETURN [ NONE | BEFORE | AFTER | DIFF | @projections ... ]
	[ TIMEOUT @duration ]
	[ PARALLEL ]
;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/relate',
    syntax: `RELATE @from -> @table -> @with
	[ CONTENT @value
	  | SET @field = @value ...
	]
	[ RETURN [ NONE | BEFORE | AFTER | DIFF | @projections ... ]
	[ TIMEOUT @duration ]
	[ PARALLEL ]
;`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/delete',
    syntax: `DELETE @targets
	[ WHERE @condition ]
	[ RETURN [ NONE | BEFORE | AFTER | DIFF | @projections ... ]
	[ TIMEOUT @duration ]
	[ PARALLEL ]
;`
});

sqldef.push({
    url: '',
    syntax: `DEFINE [
	NAMESPACE @name
	| DATABASE @name
	| LOGIN @name ON [ NAMESPACE | DATABASE ] [ PASSWORD @pass | PASSHASH @hash ]
	| TOKEN @name ON [ NAMESPACE | DATABASE ] TYPE @type VALUE @value
	| SCOPE @name
	| TABLE @name
		[ DROP ]
		[ SCHEMAFULL | SCHEMALESS ]
		[ AS SELECT @projections
			FROM @tables
			[ WHERE @condition ]
			[ GROUP [ BY ] @groups ]
		]
		[ PERMISSIONS [ NONE | FULL
			| FOR select @expression
			| FOR create @expression
			| FOR update @expression
			| FOR delete @expression
		] ]
	| EVENT @name ON [ TABLE ] @table WHEN @expression THEN @expression
	| FIELD @name ON [ TABLE ] @table
		[ TYPE @type ]
		[ VALUE @expression ]
		[ ASSERT @expression ]
		[ PERMISSIONS [ NONE | FULL
			| FOR select @expression
			| FOR create @expression
			| FOR update @expression
			| FOR delete @expression
		] ]
	| INDEX @name ON [ TABLE ] @table [ FIELDS | COLUMNS ] @fields [ UNIQUE ]
]`});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/remove',
    syntax: `REMOVE [
        NAMESPACE @name
        | DATABASE @name
        | LOGIN @name ON [ NAMESPACE | DATABASE ]
        | TOKEN @name ON [ NAMESPACE | DATABASE ]
        | SCOPE @name
        | TABLE @name
        | EVENT @name ON [ TABLE ] @table
        | FIELD @name ON [ TABLE ] @table
        | INDEX @name ON [ TABLE ] @table
    ]`
});

sqldef.push({
    url: 'https://surrealdb.com/docs/surrealql/statements/info',
    syntax: `INFO FOR [
        KV
        | NS | NAMESPACE
        | DB | DATABASE
        | SCOPE @scope
        | TABLE @table
    ];`
});
