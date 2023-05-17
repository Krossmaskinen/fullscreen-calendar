<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getMonthData, getPrevMonth, getNextMonth } from '../helpers/helpers';

	let date = new Date();
	let monthData;
	let selectedDay;
	let showDayDetails = false;
	let showAddEvent = false;

	let eventTitle = '';
	let eventStart = '';
	let eventEnd = '';
	let eventDescription = '';
	let eventName = '';

	const calendarStore = writable(JSON.parse(localStorage.getItem('calendarStore')) || {});

	calendarStore.subscribe((value) => {
		localStorage.setItem('calendarStore', JSON.stringify(value));
	});

	const selectDay = (day) => {
		selectedDay = day;
		showDayDetails = true;
	};

	const goBack = () => {
		showDayDetails = false;
	};

	const openAddEvent = () => {
		showAddEvent = true;
	};

	const closeAddEvent = () => {
		showAddEvent = false;
		eventTitle = '';
		eventStart = '';
		eventEnd = '';
		eventDescription = '';
		eventName = '';
	};

	const saveEvent = () => {
		calendarStore.update((store) => {
			const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
			if (!store[monthKey]) {
				store[monthKey] = {};
			}

			const dayKey = `${selectedDay.date.getDate()}`;
			if (!store[monthKey][dayKey]) {
				store[monthKey][dayKey] = { events: [] };
			}

			store[monthKey][dayKey].events.push({
				title: eventTitle,
				start: eventStart,
				end: eventEnd,
				description: eventDescription,
				name: eventName
			});
			return store;
		});
		closeAddEvent();
	};

	const updateMonth = (newDate) => {
		date = newDate;
		monthData = getMonthData(date);
	};

	onMount(() => {
		monthData = getMonthData(date);
	});
</script>

{#if showDayDetails}
	<div class="fixed inset-0 bg-white flex flex-col items-center justify-center p-8">
		<button on:click={goBack} class="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Back</button>
		<h2 class="text-2xl mb-4">{selectedDay.date.toDateString()}</h2>
		<p>{selectedDay.details}</p>
		{#if $calendarStore[`${date.getFullYear()}-${date.getMonth()}`] && $calendarStore[`${date.getFullYear()}-${date.getMonth()}`][`${selectedDay.date.getDate()}`]}
			{#each $calendarStore[`${date.getFullYear()}-${date.getMonth()}`][`${selectedDay.date.getDate()}`].events as event}
				<div class="mt-4">
					<h3 class="text-xl mb-2">{event.title}</h3>
					<p>{event.start} - {event.end}</p>
					<p>{event.description}</p>
					<p>{event.name}</p>
				</div>
			{/each}
		{/if}
		<button on:click={openAddEvent} class="mt-4 bg-green-500 text-white px-4 py-2 rounded"
			>Add Event</button
		>
		{#if showAddEvent}
			<div class="absolute bg-white shadow-lg rounded p-4 m-4">
				<h3 class="text-xl mb-4">Add Event</h3>
				<input bind:value={eventTitle} placeholder="Title" class="border p-2 rounded mb-2 w-full" />
				<input
					type="time"
					bind:value={eventStart}
					placeholder="Start Time"
					class="border p-2 rounded mb-2 w-full"
				/>
				<input
					type="time"
					bind:value={eventEnd}
					placeholder="End Time"
					class="border p-2 rounded mb-2 w-full"
				/>
				<textarea
					bind:value={eventDescription}
					placeholder="Description"
					class="border p-2 rounded mb-2 w-full"
				/>
				<input
					bind:value={eventName}
					placeholder="Name (Optional)"
					class="border p-2 rounded mb-2 w-full"
				/>
				<div class="flex justify-end">
					<button on:click={closeAddEvent} class="mr-2 bg-red-500 text-white px-4 py-2 rounded"
						>Close</button
					>
					<button on:click={saveEvent} class="bg-blue-500 text-white px-4 py-2 rounded">Save</button
					>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="flex justify-between p-4">
		<button
			on:click={() => updateMonth(getPrevMonth(date))}
			class="bg-blue-500 text-white px-4 py-2 rounded">Previous</button
		>
		<button
			on:click={() => updateMonth(getNextMonth(date))}
			class="bg-blue-500 text-white px-4 py-2 rounded">Next</button
		>
	</div>

	<h2 class="text-2xl text-center mb-4">
		{date.toLocaleString('default', { month: 'long' })}
		{date.getFullYear()}
	</h2>

	{#if monthData}
		<div class="grid grid-cols-7 gap-4 p-4">
			{#each monthData as day, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={() => selectDay(day)} class="border p-4 rounded cursor-pointer">
					<h3 class="text-xl">{day.date.getDate()}</h3>
					<p>{day.details}</p>
					{#if $calendarStore[`${date.getFullYear()}-${date.getMonth()}`] && $calendarStore[`${date.getFullYear()}-${date.getMonth()}`][`${day.date.getDate()}`]}
						{#each $calendarStore[`${date.getFullYear()}-${date.getMonth()}`][`${day.date.getDate()}`].events as event}
							<div class="mt-2">
								<h4 class="text-lg">{event.title}</h4>
								<p>{event.start} - {event.end}</p>
							</div>
						{/each}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{/if}
