import java.util.Arrays;

class Solution {
    public static int lengthOfLongestConsecutiveSequence(int[] nums, int N) {
        if(nums.length == 0) return 0;
        Arrays.sort(nums);
        int longest = 1;
        int curr = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i-1]==nums[i]) continue;
            else if (nums[i]==nums[i-1]+1) {
                curr++;
            }
            else {
                longest = Math.max(longest,curr);
                curr = 0;
            }
        }
        longest = Math.max(longest,curr);
        return longest;


    }
}
