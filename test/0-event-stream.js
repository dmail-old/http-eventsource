import EventStream from '../lib/event-stream.js';

export function suite(add){
	var correspondances = [
		{
			writes: [
				'data: My message\n\n'
			],
			events: [
				{type: 'message', data: 'My message'}
			]
		},
		{
			writes: [
				"data: first line\n",
				"data: second line\n\n"
			],
			events: [
				{type: 'message', data: 'first line\nsecond line'}
			]
		},
		{
			writes: [
				"id: 12345\n",
				"data: GOOG\n",
				"data: 556\n\n"
			],
			events: [
				{type: 'message', lastEventId: '12345', data: 'GOOG\n556'}
			]
		},
		{
			writes: [
				"event: foo\n",
				"data: test\n\n",
				"data: last\n\n"
			],
			events: [
				{type: 'foo', data: 'test'},
				{type: 'message', data: 'last'}
			]
		}
	];

	correspondances.forEach(function(correspondance, index){
		add('coresspondance #' + index, function(test){
			var stream = EventStream.create();

			stream.onevent = test.spy();
			correspondance.writes.forEach(function(write){
				stream.write(write);
			});

			correspondance.events.forEach(function(event, index){
				test.calledWith(stream.onevent.calls[index], event);
			});
		});
	});

	add('retry', function(test){
		var stream = EventStream.create();

		stream.onretry = test.spy();
		stream.write('retry: 10000\ndata: hello world\n\n');

		test.calledWith(stream.onretry, 10000);
	});
}
